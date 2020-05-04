window.onload = () => {

    let parkings = document.getElementById('list-parkings').childNodes
    let canvas = []
    let contexts = []
    
    //On récupère tous les canvas HTML que l'on va travailler par la suite, on sépare les éléments canvas HTML de leurs contextes 2D respectifs
    for (let i = 1; i < parkings.length; i += 2) {
        const element = parkings[i]
        canvas.push(element)
        const context = element.getContext('2d')
        contexts.push(context)
    }

    const url = "https://data.rennesmetropole.fr/api/records/1.0/search/?dataset=export-api-parking-citedia"        
    
    let totalPlaces = []
    let totalLibres = []
    let labelsParking = []
    let status = []

    function app(){
        getData().then(() =>{
        for (let i = 0; i <= 9; i++) {
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
        if (status == "OUVERT"){
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
        const response =  await fetch(url)
        const data = await response.json()


        //On récupère les noms des parkings
        for (let i = 0; i <= 9; i++) {
            const name = data.records[i].fields.key
            labelsParking.push(name)
        }


        // On récupère les places totales
        for (let i = 0; i <= 9; i++) {
            const maxPlaces = data.records[i].fields.max
            totalPlaces.push(maxPlaces)
        }

        // On récupère les places libres
        for (let i = 0; i <= 9; i++) {
            const freePlaces = data.records[i].fields.free
            totalLibres.push(freePlaces)
        }
        
        
        // On récupère le status (ouvert ou fermé)
        for (let i = 0; i <= 9; i++) {
            const statut = data.records[i].fields.status
            status.push(statut)
        } 
    }
}