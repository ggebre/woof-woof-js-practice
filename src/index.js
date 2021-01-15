document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.querySelector("#dog-bar")
    const dogInfo = document.querySelector("#dog-info")
    const goodDogFilterButton = document.querySelector("#good-dog-filter")

    fetch("http://localhost:3000/pups")
    .then(resp => resp.json())
    .then(pupObjs => {

        goodDogFilterButton.addEventListener('click', (event) => {
            let text = "Filter good dogs:"
            if (event.target.textContent.endsWith("OFF")){
                text += " ON"
                filterPubsBy(pupObjs, true)
            } else {
                text += " OFF"
                filterPubsBy(pupObjs, false)
            }
            event.target.textContent = text
            dogBarChildrenEventListener()
        })
        pupObjs.forEach(pupObj => dogBar.innerHTML += `<span data-id=${pupObj.id}> ${pupObj.name}</span>`)
        
        dogBarChildrenEventListener()
       
    })
     
    function fetchAPupById(id){
        fetch(`http://localhost:3000/pups/${id}`)
        .then(resp => resp.json())
        .then(pup => {
        const buttonText = pup.isGoodDog ? "Good Dog!" : "Bad Dog!"
        dogInfo.innerHTML = `<h2> ${pup.name} </h2>
        <img src=${pup.image}><br>
        <button class="toggle-button" data-id=${pup.id}>${buttonText} </button>`
   
        document.querySelector(".toggle-button").addEventListener('click', (event) => {
                    
                    pup.isGoodDog = !pup.isGoodDog 
                    updatePupById(pup, event)
        })      

    })
    } 

    function filterPubsBy(pupObjs, isGood){
        dogBar.innerHTML = ""
        pupObjs.forEach(pupObj => {
            if (pupObj.isGoodDog == isGood){
                dogBar.innerHTML += `<span data-id=${pupObj.id}> ${pupObj.name}</span>`
            }
        })
    }

    function dogBarChildrenEventListener(){
        for(const child of dogBar.children){
            child.addEventListener('click', (event) => {
                const pupId = event.target.dataset.id
                fetchAPupById(pupId)

            })
        } 
    }
    
    function displayPupDetail(pup){
        dogInfo.innerHTML = `<h2> ${pup.name} </h2>
        <img src=${pup.image}><br>
        <button class="toggle-button" data-id=${pup.id}>${buttonText} </button>`
    }

    function updatePupById(obj, event) {
        
        fetch(`http://localhost:3000/pups/${obj.id}`, {
            method: "PATCH",
            headers: {
                        "Content-Type": "application/json",
                        'Accept': "application/json"
                        },
            body: JSON.stringify(obj)
        
        })
        .then(resp => resp.json())
        .then(pup => {
            const buttonText = pup.isGoodDog ? "Good Dog!" : "Bad Dog!"
            event.target.textContent = buttonText
        })
    }
    
})