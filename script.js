window.onload = () => {

    let parkings = document.getElementById('list-parkings').childNodes
    let parcRelais = document.getElementById('list-parcrelais').childNodes
    
    let canvas = []
    let contexts = []
    
    //On récupère tous les canvas HTML que l'on va travailler par la suite, on sépare les éléments canvas HTML de leurs contextes 2D respectifs
    for (let i = 1; i < parkings.length; i += 2) {
        const element = parkings[i]
        canvas.push(element)
        const context = element.getContext('2d')
        contexts.push(context)
    }
    for (let i = 1; i < parcRelais.length; i += 2) {
        const element = parcRelais[i]
        canvas.push(element)
        const context = element.getContext('2d')
        contexts.push(context)
    }
    
    const urlParkings = "https://data.rennesmetropole.fr/api/records/1.0/search/?dataset=export-api-parking-citedia"
    const urlParcRelais = "https://data.explore.star.fr/api/records/1.0/search/?dataset=tco-parcsrelais-star-etat-tr&facet=nom&facet=etat"       
    
    let totalPlaces = []
    let totalLibres = []
    let labelsParking = []
    let status = []

    function app(){
        getData().then(() =>{
        for (let i = 0; i <= 14; i++) {
            charIt(contexts[i], labelsParking[i], totalPlaces[i], totalLibres[i],status[i]).then(()=>{
                canvas.forEach(element =>{
                    element.style.display = "inline-block"
                })
            })
        } 
    })}

    app()
    window.setInterval(()=> {
        app()
    },300000)

    // On dessine les graphiques avec les données récupérées sur chacun des canvas, en vérifiant si le parking est ouvert.
    async function charIt(context, label, maxPlace, freePlace, status){
        if (status == "OUVERT" || status == "Ouvert"){
            var myChart = new Chart(context, {
                type: 'doughnut',
                data: {
                    labels: ['Occupées', 'Libres'],
                    datasets: [{
                      data: [(maxPlace-freePlace), freePlace],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.2)'
                      ]
                    }]
                  },
                options: {
                    responsive:false,
                    title :{
                        display : true,
                        text : label + " - Places libres : "+ freePlace
                    },
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 15,
                            bottom: 10
                        }
                    }
                }
            });
        }else{
            var myChart = new Chart(context, {
                type: 'doughnut',
                data: {
                    labels: ['Occupées', 'Libres'],
                    datasets: [{
                      data: [100, 0],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.2)'
                      ]
                    }]
                  },
                options: {
                    responsive:false,
                    title :{
                        display : true,
                        text : label + " - Ce parking est fermé."
                    },
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 15,
                            bottom: 10
                        }
                    }
                }
            });
        }
    }
    // On récupère les données avec cette fonction que l'on placera dans des arrays
    async function getData(){
        const responseParking =  await fetch(urlParkings)
        const dataParkings = await responseParking.json()

        const responseParcRelais =  await fetch(urlParcRelais)
        const dataParcRelais = await responseParcRelais.json()


        //On récupère les noms des parkings
        for (let i = 0; i <= 9; i++) {
            const name = dataParkings.records[i].fields.key
            labelsParking.push(name)
        }


        // On récupère les places totales des parkings
        for (let i = 0; i <= 9; i++) {
            const maxPlaces = dataParkings.records[i].fields.max
            totalPlaces.push(maxPlaces)
        }

        // On récupère les places libres des parkings
        for (let i = 0; i <= 9; i++) {
            const freePlaces = dataParkings.records[i].fields.free
            totalLibres.push(freePlaces)
        }
        
        
        // On récupère le status (ouvert ou fermé) des parkings
        for (let i = 0; i <= 9; i++) {
            const statut = dataParkings.records[i].fields.status
            status.push(statut)
        }

        //On récupère les noms des Parc Relais
        for (let i = 0; i <= 4; i++) {
            const name = dataParcRelais.records[i].fields.nom
            labelsParking.push(name)
        }


        // On récupère les places totales des Parc Relais
        for (let i = 0; i <= 4; i++) {
            const maxPlaces = dataParcRelais.records[i].fields.capaciteactuelle
            totalPlaces.push(maxPlaces)
        }

        // On récupère les places libres des Parc Relais
        for (let i = 0; i <= 4; i++) {
            const freePlaces = dataParcRelais.records[i].fields.nombreplacesdisponibles
            totalLibres.push(freePlaces)
        }
        
        
        // On récupère le status (ouvert ou fermé) des Parc Relais
        for (let i = 0; i <= 4; i++) {
            const statut = dataParcRelais.records[i].fields.etat
            status.push(statut)
        }
        console.log(labelsParking)
    }
}
