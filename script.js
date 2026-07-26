// ================================
// ELEMENTS
// ================================


const searchBtn = document.getElementById("searchBtn");

const fundInput = document.getElementById("fundInput");

const searchResults = document.getElementById("searchResults");

const loadingMessage = document.getElementById("loadingMessage");



const fundTitle = document.getElementById("fundTitle");

const amc = document.getElementById("amc");

const nav = document.getElementById("nav");

const date = document.getElementById("date");

const code = document.getElementById("code");

const category = document.getElementById("category");



let allFunds = [];

let navChart = null;





// ================================
// LOAD ALL MUTUAL FUNDS
// ================================


async function loadFunds(){


    try{


        const response = await fetch(
            "https://api.mfapi.in/mf"
        );


        allFunds = await response.json();


        console.log("Funds Loaded:", allFunds.length);


    }


    catch(error){


        console.log(error);

        loadingMessage.innerHTML =
        "Unable to load mutual funds";


    }


}



loadFunds();





// ================================
// SEARCH BUTTON
// ================================


searchBtn.addEventListener(
"click",
()=>{


    const query = fundInput.value.trim();


    if(query===""){

        alert("Enter mutual fund name");

        return;

    }


    searchFund(query);



});





// ================================
// LIVE SEARCH
// ================================


fundInput.addEventListener(
"input",
()=>{


    const query =
    fundInput.value.toLowerCase();


    searchResults.innerHTML="";


    if(query.length < 3)
    return;



    const matches =
    allFunds
    .filter(fund=>

        fund.schemeName
        .toLowerCase()
        .includes(query)

    )
    .slice(0,5);




    matches.forEach(fund=>{


        const card =
        document.createElement("div");


        card.className="search-card";


        card.innerHTML =
        fund.schemeName;



        card.onclick=()=>{


            fundInput.value =
            fund.schemeName;


            searchResults.innerHTML="";


            getFundData(
            fund.schemeCode
            );


        };



        searchResults.appendChild(card);



    });



});






// ================================
// SEARCH FUNCTION
// ================================


function searchFund(query){



    const result =
    allFunds.find(fund=>

        fund.schemeName
        .toLowerCase()
        .includes(
            query.toLowerCase()
        )

    );



    if(!result){


        alert("Mutual fund not found");

        return;


    }



    getFundData(
        result.schemeCode
    );



}







// ================================
// FETCH FUND DATA
// ================================


async function getFundData(schemeCode){



    try{


        loadingMessage.innerHTML =
        "Fetching live NAV data...";



        const response =
        await fetch(

        `https://api.mfapi.in/mf/${schemeCode}`

        );



        const data =
        await response.json();



        console.log(data);




        loadingMessage.innerHTML="";





        // DETAILS


        fundTitle.innerHTML =
        data.meta.scheme_name;



        amc.innerHTML =
        data.meta.fund_house;



        category.innerHTML =
        data.meta.scheme_category;



        code.innerHTML =
        data.meta.scheme_code;





        // LATEST NAV


        const latest =
        data.data[0];



        nav.innerHTML =
        latest.nav;



        date.innerHTML =
        latest.date;





        // CREATE GRAPH


        createChart(data.data);



    }



    catch(error){


        console.log(error);


        loadingMessage.innerHTML =
        "Error fetching data";


    }



}







// ================================
// CREATE CHART
// ================================


function createChart(navData){



    const chartData =
    navData
    .slice(0,100)
    .reverse();




    const labels =
    chartData.map(item=>

        item.date

    );



    const values =
    chartData.map(item=>

        Number(item.nav)

    );





    const ctx =
    document
    .getElementById("navChart");





    if(navChart){

        navChart.destroy();

    }





    navChart =
    new Chart(ctx,{



        type:"line",



        data:{


            labels:labels,


            datasets:[{


                label:"NAV Value",


                data:values,


                borderWidth:2,


                tension:0.3



            }]



        },




        options:{


            responsive:true,


            maintainAspectRatio:false,


            plugins:{


                legend:{


                    display:true


                }


            },


            scales: {

    x: {

        ticks: {

            maxTicksLimit: 8,
            color: "#000000"

        }

    },


    y: {

        ticks: {

            color: "#000000"

        }

    }

}



        }



    });



}