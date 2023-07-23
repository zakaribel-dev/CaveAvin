window.addEventListener("load", () => {
    const table = document.getElementById("table_id");
    table.className = "table table-danger table-hover container mt-5 text-center";

    const limit = 10;
    const msg = document.getElementById('msg');
    let wines = [];
    
    const requestOptionsGet = {
      method: "GET",
      redirect: "follow",
    };

    
    function manageWines(urlApiVins) {
        
          fetch(urlApiVins + "?include=COULEUR,REGION,APPELLATION&transform=1", requestOptionsGet)
            .then((response) => response.json())
            .then(function (data) {
              wines = data;

              display();
              addWine();
              deleteWine();
              editWine();
              viewWine();
            })
            .catch(function (error) {
              console.log("Une erreur s'est produite lors de la récupération des données :", error);
            });

          }
  
      /////////// ADD ///////////
      function addWine(){

     
        const code_select_generated_Appellation = document.createElement("select");
        code_select_generated_Appellation.setAttribute("id", "id_selectAppellation");
        const code_select_generated_color = document.createElement("select");
        code_select_generated_color.setAttribute("id", "id_selectColor");
        const code_select_generated_region = document.createElement("select");
        code_select_generated_region.setAttribute("id", "id_selectRegion");
  
  
        // combo des appellations
        fetch(urlApiAppellation, requestOptionsGet)
        .then((response) => response.json())
        .then(function (data) {
          const comboAppellation = document.getElementById("comboAppellation");
      
          data.APPELLATION.records.forEach((app) => {
  
            const code_option_generated_Appellation = document.createElement("option");
            code_option_generated_Appellation.value = app[0];
            code_option_generated_Appellation.innerText = app[1];
            code_select_generated_Appellation.appendChild(code_option_generated_Appellation);
            comboAppellation.appendChild(code_select_generated_Appellation);
          });
        });
      
      // combo des couleurs
      fetch(urlApiCouleur, requestOptionsGet)
        .then((response) => response.json())
        .then(function (data) {
          const comboColor = document.getElementById("comboColor");
      
          data.COULEUR.records.forEach((couleur) => {
            const code_option_generated_color = document.createElement("option");
            code_option_generated_color.value = couleur[0];
            code_option_generated_color.innerText = couleur[1];
            code_select_generated_color.appendChild(code_option_generated_color);
            comboColor.appendChild(code_select_generated_color);
          });
        });
      
      // combo des regions
      fetch(urlApiRegion, requestOptionsGet)
        .then((response) => response.json())
        .then(function (data) {
          const comboRegion = document.getElementById("comboRegion");
      
          data.REGION.records.forEach((vin) => {
            const code_option_generated_region = document.createElement("option");
            code_option_generated_region.value = vin[0];
            code_option_generated_region.innerText = vin[2];
            code_select_generated_region.appendChild(code_option_generated_region);
            comboRegion.appendChild(code_select_generated_region);
          });
        });
    
  
         // evenement d'ajout
        document.getElementById("new_wine").addEventListener("click", () => {
          $(".modal-addNomAppellation").html("Appellation");
          $(".modal-addNomCouleur").html("Couleur");
          $(".modal-addNomRegion").html("Région");
          $(".modal-addNomVin").html("Nom du vin");
          $(".modal-addCulture").html("Culture");
          $(".modal-addCommentaire").html("Commentaires");
  
    
          $("#addModal").modal("show");
    
          document.getElementById("saveChangesBtnAdd").addEventListener("click", () => {
              const AddNomVin =document.getElementById("nomVin").value;
              const AddCulture =document.getElementById("culture").value;
              const AddCommentaire =document.getElementById("commentaire").value;
  
              const selectAppellation = document.getElementById("id_selectAppellation").value;
              const selectColor = document.getElementById("id_selectColor").value;
              const selectRegion = document.getElementById("id_selectRegion").value;
  
              console.log(selectAppellation);
  
              if (AddNomVin.length === 0 || AddCulture.length === 0 || AddCommentaire.length === 0) {
               
                  Swal.fire('Hey &#128545; !', '<b>Merci de remplir tous les champs demandés...</b>', 'error');
  
              } else {
                let requestOptionsPost = {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
    
                  body: JSON.stringify({
                    CODEAPPELLATION: selectAppellation,
                    CODECOULEUR : selectColor,
                    CODEREGION : selectRegion,
                    NOM_CUVEE: AddNomVin,
                    COMMENTAIRES : AddCommentaire,
                    TYPE_DE_CULTURE : AddCulture
                  }),
                };
    
                fetch(urlApiVins, requestOptionsPost)
                  .then((response) => response.json())
                  .then(function (data) {
                    $("#addModal").modal("hide");
                    displayMsg(false,false,true,data)
  
                  })
                  .catch(function (error) {
                    alert("Ajax error: " + error);
                  });
              }
            });
        });
      }
            
     
  
      //DISPLAY // 
   
      function display(){

        wines.VIN.map(function (vinElement) {
          let tr = document.createElement("tr");
          tr.setAttribute('class','data');// je met une classe data à toute mes lignes dans le but de pouvoir en afficher certaines et d'en cacher d'autres tout en évitant de filtrer la tr contenant mes th
  
          let codeVinTd = document.createElement("td");
          codeVinTd.textContent = vinElement.CODEVIN;
  
          let nomVinTd = document.createElement("td");
          nomVinTd.textContent = vinElement.NOM_CUVEE;
  
          let appellationTd = document.createElement("td");
          appellationTd.textContent = vinElement.CODEAPPELLATION;
  
          let regionTd = document.createElement("td");
          let couleurTd = document.createElement("td");
          let cultureTd = document.createElement("td");
          let commentairesTd = document.createElement("td");
          let actionsTd = document.createElement("td");
          actionsTd.style.width = "150px";
          

  // ici je cherche à savoir si le code couleur de l'api COULEUR (color.CODECOULEUR) 
  // match bien avec le code couleur de l'api VIN (vinElement.CODECOULEUR) et ce, en utilisant la fonction "find"
          let colorObj = vinElement.COULEUR.find((color) => color.CODECOULEUR === vinElement.CODECOULEUR);
    // A savoir que vinElement.COULEUR tout simplement car quand j'ai fait mon call api, j'ai ajouté l'api COULEUR dans mon include 
  //c'est pour ça que j'y ai accès

          if (colorObj) {
    // si la fonction find renvoie true (c'est àa dire qu'il ya un match) alors on recupere la valeur NOMCOULEUR de l'api COULEUR
            couleurTd.textContent = colorObj.NOMCOULEUR; 
          } else {
            couleurTd.textContent = "Couleur non trouvée, désolé !!";
          }
  
          // à la recherche de THE region :)
          let regionObj = vinElement.REGION.find((region) => region.CODEREGION === vinElement.CODEREGION);
          if (regionObj) {
              regionTd.textContent = regionObj.NOMREGION;
            } else {
              regionTd.textContent = "Region non trouvée sorry!";
            }
          
            // à la recherche de THE appellation :)
            let appellationObj = vinElement.APPELLATION.find((appellation) => appellation.CODEAPPELLATION === vinElement.CODEAPPELLATION);
            if (appellationObj) {
                appellationTd.textContent = appellationObj.NOMAPPELLATION;
              } else {
                appellationTd.textContent = "appellation non trouvée sorry!!";
              }
  
          cultureTd.textContent = vinElement.TYPE_DE_CULTURE;
          commentairesTd.textContent = vinElement.COMMENTAIRES;
  
          actionsTd.innerHTML = `
            <button class="modif btn btn-info btn-sm fas fa-pencil-alt fa-sm"></button>
            <button class="delete btn btn-danger btn-sm fas fa-trash-alt fa-sm"></button>
            <button class="view btn btn-success btn-sm fas fa-eye fa-sm"></button>
          `;
  
          tr.appendChild(codeVinTd);
          tr.appendChild(nomVinTd);
          tr.appendChild(appellationTd);
          tr.appendChild(regionTd);
          tr.appendChild(couleurTd);
          tr.appendChild(cultureTd);
          tr.appendChild(commentairesTd);
          tr.appendChild(actionsTd);
  
          table.appendChild(tr);
          let count =  0;
  
          for (let i = 0; i < table.rows.length; i++) {  // je check le nombre de lignes générées en fonction de ce qu'il y a dans l'API
            if (table.rows[i].nodeName === "TR") {
              count++;
            }
          }
  
          if (count > limit) {  // si le nombre de tr dépasse la limite alors j'affiche le bouton qui me permet de scroll tout en bas
            scrollTopButton.style.visibility = "visible";
            scrollDownButton.style.visibility = "visible";
          } else {
            scrollTopButton.style.visibility = "hidden";
            scrollDownButton.style.visibility = "hidden";
          }
        });
      }
    
      // DELETE //

      function deleteWine() {
        let btnDelete = document.getElementsByClassName("delete");
      
        for (let i = 0; i < btnDelete.length; i++) {
          btnDelete[i].addEventListener("click", function () {
            let row = this.parentNode.parentNode;
            let codeVin = row.childNodes[0].textContent;
      
            Swal.fire({
              title: '&#128552;',
              html: "<b>Vous êtes sûr de vouloir supprimer le vin " + codeVin + " ?</b>",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Oui',
              cancelButtonText: 'Non'
            }).then((result) => {
              if (result.isConfirmed) {
                table.removeChild(row);
      
                let requestOptionsDelete = {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                };

                fetch(urlApiVins + "/" + codeVin, requestOptionsDelete)
                  .then((response) => response.json())
                  .then(function () {
                    displayMsg(true, false, false, codeVin);
                  })
                  .catch(function (error) {
                    alert("Ajax error: " + error);
                  });
               }
            });
          });
        }
      }

        // EDIT //
  
      function editWine(){
  

          const code_select_generated_Appellation = document.createElement("select");
          code_select_generated_Appellation.setAttribute("id", "id_selectEditAppellation");
          const code_select_generated_color = document.createElement("select");
          code_select_generated_color.setAttribute("id", "id_selectEditColor");
          const code_select_generated_region = document.createElement("select");
          code_select_generated_region.setAttribute("id", "id_selectEditRegion");


              // combo des appellations
      fetch(urlApiAppellation, requestOptionsGet)
      .then((response) => response.json())
      .then(function (data) {
        const comboAppellation = document.getElementById("comboModifAppellation");
        
        data.APPELLATION.records.forEach((app) => {

          const code_option_generated_Appellation = document.createElement("option");
          code_option_generated_Appellation.value = app[0];
          code_option_generated_Appellation.innerText = app[1];
          code_select_generated_Appellation.appendChild(code_option_generated_Appellation);
          comboAppellation.appendChild(code_select_generated_Appellation);
        });
      });
    
    // combo des couleurs
    fetch(urlApiCouleur, requestOptionsGet)
      .then((response) => response.json())
      .then(function (data) {
        const comboColor = document.getElementById("comboEditColor");
    
        data.COULEUR.records.forEach((couleur) => {
          const code_option_generated_color = document.createElement("option");
          code_option_generated_color.value = couleur[0];
          code_option_generated_color.innerText = couleur[1];
          code_select_generated_color.appendChild(code_option_generated_color);
          comboColor.appendChild(code_select_generated_color);
        });
      });
    
    // combo des regions
    fetch(urlApiRegion, requestOptionsGet)
      .then((response) => response.json())
      .then(function (data) {
        const comboRegion = document.getElementById("comboEditRegion");
    
        data.REGION.records.forEach((vin) => {
          const code_option_generated_region = document.createElement("option");
          code_option_generated_region.value = vin[0];
          code_option_generated_region.innerText = vin[2];
          code_select_generated_region.appendChild(code_option_generated_region);
          comboRegion.appendChild(code_select_generated_region);
        });
      });
       
        let btnModif = document.getElementsByClassName("modif");
        for (let i = 0; i < btnModif.length; i++) {
          btnModif[i].addEventListener("click", function () {
            const row = this.parentNode.parentNode;
            const code = row.cells[0].textContent;

            $(".modal-ModifAppellation").html("Modifier l'Appellation");
            $(".modal-ModifNomCouleur").html("Modifier la Couleur");
            $(".modal-ModifNomRegion").html("Modifier la Région");
            $(".modal-ModifNomVin").html("Modifier le Nom du vin");
            $(".modal-ModifCulture").html("Modifier la Culture");
            $(".modal-ModifCommentaire").html("Modifier le Commentaire");
  
            $("#editModal").modal("show");

      
            const EditNomVin = document.getElementById("EditNomVin");
            const EditCulture = document.getElementById("ModifCulture");
            const EditCommentaire = document.getElementById("ModifCommentaire");
            EditNomVin.value = row.cells[1].textContent;
            EditCulture.value = row.cells[5].textContent
            EditCommentaire.value = row.cells[6].textContent
    
            document .getElementById("saveChangesBtnModif").addEventListener("click", () => {


              Swal.fire({
                html: "<b>Vous êtes sûr de vouloir modifier le vin " + code + " ?</b>",
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Oui',
                cancelButtonText: 'Non'
              }).then((result) => {
                if (result.isConfirmed) {
             
                  const EditNomVin =document.getElementById("EditNomVin").value;
                  const EditCulture =document.getElementById("ModifCulture").value;
                  const EditCommentaire =document.getElementById("ModifCommentaire").value;
      
                  const selectAppellation = document.getElementById("id_selectEditAppellation").value;
                  const selectColor = document.getElementById("id_selectEditColor").value;
                  const selectRegion = document.getElementById("id_selectEditRegion").value;
    
                    
                  let requestOptionsPut = {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
      
                    body: JSON.stringify({
                      CODEAPPELLATION: selectAppellation,
                      CODECOULEUR : selectColor,
                      CODEREGION : selectRegion,
                      NOM_CUVEE: EditNomVin,
                      COMMENTAIRES : EditCommentaire,
                      TYPE_DE_CULTURE : EditCulture
                    }),
                  };
        
               
                    fetch(urlApiVins + "/" + code, requestOptionsPut)
                      .then((response) => response.json())
                      .then(function () {
    
                        row.cells[1].textContent = EditNomVin;
                        row.cells[5].textContent = EditCulture;
                        row.cells[6].textContent = EditCommentaire;
    
                        displayMsg(false,true,false,code,row)
    
                        $("#editModal").modal("hide");
                      })
                      .catch(function (error) {
                        alert("Ajax error: " + error);
                      });     
             }              
           });
         });
       });
      }
    }

      function displayMsg(deleteRow, editRow,addedRow, row, rowObj = null) {
      
        if (deleteRow) {
    
          Swal.fire('&#128532;', "<b>Vin numéro " +row+ " supprimé</b>", 'success');
    
        } else if (editRow) {
          console.log(rowObj)
          Swal.fire('Hey &#129488; !', "<b>Vin numéro " + row + " modifié</b>", 'info').then((result) => {
            if (result.isConfirmed) {
              const rowElement = rowObj.closest('tr');
              rowElement.classList.add('flash-animation');
              setTimeout(() => {
                rowElement.classList.remove('flash-animation');
              }, 2000);
            }
          });
        }else if(addedRow){
          Swal.fire('&#128077;', "<b>Vin numéro " +row+ " ajouté. Cliquez sur la flèche pour aller en bas.</b>", 'success').then((result) =>{
            if(result.isConfirmed){
              location.reload();
            }
          });
        }
      }
      
      function viewWine() {
        let btnVue = document.getElementsByClassName('view');
        for (let i = 0; i < btnVue.length; i++) {
          btnVue[i].addEventListener('click', function () {
            let row = this.parentNode.parentNode;

            let codeVin = row.cells[0].textContent;
            let nomRegion = row.cells[3].textContent;
            let nomVin = row.cells[1].textContent;
            let Appellation = row.cells[2].textContent;
            let Couleur = row.cells[4].textContent;
            let Culture = row.cells[5].textContent;
            let Commentaires = row.cells[6].textContent;
   
            let modalTitle = document.querySelector('.modal-title');
            
            modalTitle.innerHTML = 
            "Code vin : " + codeVin + "<br><br>Nom du vin : " + nomVin + "<br><br>Appellation : " 
            + Appellation + "<br><br>Région : " + nomRegion + "<br><br>Couleur : " + Couleur + "<br><br>Culture : " + Culture + 
            "<br><br>Commentaires : " + Commentaires;
          
            $('#viewModal').modal('show');
          });
        }
      }


  function searchWines() {
    const searchBarValue = document.getElementById('search').value;
    const rows = table.getElementsByClassName("data");
    let matchesFound = false; // flag
    msg.innerHTML ="";
    table.style.visibility = "visible";
    scrollDownButton.style.visibility = "visible";
    scrollTopButton.style.visibility = "visible";
  
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      let rowMatches = false; // flag
  
      for (let j = 0; j < row.cells.length; j++) {
        const cell = row.cells[j];
        const cellValue = cell.textContent.toLowerCase(); // je met toLowerCase pour faire en sorte que ce soit pas sensible à la casse
  
        if (cellValue.includes(searchBarValue.toLowerCase())) { // ici, si un l'input match avec les l'une des cellules de toute les row 
          //alors j'active le flag pour dire qu'il ya un match
          rowMatches = true;
          break;  
        }
      }
  
      if (rowMatches) {
        row.style.display = "";
        matchesFound = true;
      } else {
        row.style.display = "none";
      }
    }
  
    if (!matchesFound) {

      table.style.visibility = "hidden";
      scrollDownButton.style.visibility = "hidden";
      scrollTopButton.style.visibility = "hidden";
      msg.innerHTML = "<b>Aucune correspondance pour : " +searchBarValue+ " &#128532</b>";
    } 
  
  }
  
  // initialisation du search
    const Input = document.getElementById("search");
  
    Input.addEventListener("input", (event) => {
      event.preventDefault();
      searchWines();
    });

    // Initialisation de mes boutons de navigation
    const scrollDownButton = document.getElementById('scrollButton');
    const scrollTopButton = document.getElementById('scrollTopButton');


    scrollDownButton.addEventListener('click', function() {
      const full_page = document.documentElement; // document.documentElement represente toute ma page 
      full_page.scrollIntoView({ behavior: 'smooth', block: 'end' }); // j'utilise la fonction scrollIntoView qui me permet d'aller en bas de la page de manière 'smooth'
    });
  
    scrollTopButton.addEventListener('click', function() {
      const topElement = document.body; // ici document.body represente l'élément le plus haut de la page alors je demande simplement à ma foncttion scrollintoview d"y scroller 
  
      topElement.scrollIntoView({ behavior: 'smooth' }); 
     }); 


     
    // Appel de ma fonction principal qui va ensuite trigger les autres fonctions nécessaires un peu comme un effet domino :)
     manageWines(urlApiVins)
  });
  