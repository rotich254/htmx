import express from "express";
const app = express();

//set static folder
app.use(express.static("public"));
//parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended:true}));
//parse JSON BODIES (as sent by API clients )
app.use(express.json());
//handle GET request to fetch users
app.get("/users", async (req, res) =>{
    // const users = [
    //     {id:"1", name:"John"},
    //     {id:"2",name:"Emily"},
    //     {id:"3",name:"Sophia"},

    // ];
    setTimeout( async () => {
        const limit = +req.query.limit || 10;

        const response = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=${limit}`);
        const users = await response.json();
    
        res.send(`
            <h1 class="text-2xl font-bold my-4">Users</h1>
            <ul>
            ${users.map((users) => `<li>${users.name}</li>`).join('')}
            `);
    }, 1000);
});
// Handle POST request for temparature conversion 

app.post('/convert', (req, res) => {
    setTimeout(() => {
        const fahrenheit = parseFloat(req.body.fahrenheit);
        const celsius = (fahrenheit -32)* (5 / 9);
        res.send(
            `<p> ${fahrenheit} degrees Farenheit is equal to ${celsius} degrees Celsius 
            </p>`
        );

    }, 1000)
});
let counter = 0;
// Handle GET request for polling example 
app.get('/poll', (req, res) => {
    counter++;
    const data = { value:counter };
    res.json(data);
});

let currentTemparature = 20;
//Handle GET request for weather
app.get('/get-temperature', (req, res) => {
    currentTemparature += Math.random() * 2 -1; //Random teparature change
    res.send(currentTemparature.toFixed(1) + '°C');
});

const contacts = [
    { name: 'John', email: 'john@gmail.com'},
    { name: 'Emma', email: 'emma@yahoo.com'},
    { name: 'Elis', email: 'elis@yahoo.com'},
    { name: 'malao', email: 'malao@yahoo.com'},
    { name: 'yesi', email: 'yetsi@yahoo.com'},
    { name: 'hilton', email: 'hilton@yahoo.com'},
    { name: 'miriam', email: 'miriam@yahoo.com'},
];

//Handle POST req for contact search
app.post('/search', (req, res) => {
    const searchTerm = req.body.search.toLowerCase();

    if (!searchTerm) {
        return res.send(`<tr></tr>`);

    }
    const searchResults = contacts.filter((contacts) => {
        const name = contacts.name.toLowerCase();
        const email = contacts.email.toLowerCase();

        return name.includes(searchTerm) || email.includes(searchTerm);

    } ) ;
    setTimeout(() => {
        const searchResultHtml = searchResults.map(contacts => `
        <tr>
        <td><div class="my-4 p-2">${contacts.name}</div></td>
        <td><div class="my-4 p-2">${contacts.email}</div></td>
        </tr>`).join('');
        res.send(searchResultHtml);
        
    }, 1000);
})
//Handle POST req for contact search from JSONplaceholder
app.post('/search/api', async (req, res) => {
    const searchTerm = req.body.search.toLowerCase();

    if (!searchTerm) {
        return res.send(`<tr></tr>`);

    }
    const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
    const contacts = await response.json();

    const searchResults = contacts.filter((contacts) => {
        const name = contacts.name.toLowerCase();
        const email = contacts.email.toLowerCase();

        return name.includes(searchTerm) || email.includes(searchTerm);

    } ) ;
    setTimeout(() => {
        const searchResultHtml = searchResults.map(contacts => `
        <tr>
        <td><div class="my-4 p-2">${contacts.name}</div></td>
        <td><div class="my-4 p-2">${contacts.email}</div></td>
        </tr>`).join('');
        res.send(searchResultHtml);
        
    }, 1000);
});

//Handle POST request for email validation
app.post('/contact/email', (req, res) => {
    const submittedEmail = req.body.email;
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    const isValid ={
        message: 'That email is valid',
        class: 'text-green-700'
    };

    const isInvalid = {
        message: 'Please enter a valid email address',
        class:'text-red-600'
    };
    if (!emailRegex.test(submittedEmail)) {
        return res.send(
          `
          <div class="mb-4" hx-target="this" hx-swap="outerHTML">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
            >Email Address</label
          >
          <input
            name="email"
            hx-post="/contact/email"
            class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
            type="email"
            id="email"
            value="${submittedEmail}"
            required
          />
          <div class="${isInvalid.class}">${isInvalid.message}</div>
        </div>
          `
        );
      } else {
        return res.send(
          `
          <div class="mb-4" hx-target="this" hx-swap="outerHTML">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
            >Email Address</label
          >
          <input
            name="email"
            hx-post="/contact/email"
            class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
            type="email"
            id="email"
            value="${submittedEmail}"
            required
          />
          <div class="${isValid.class}">${isValid.message}</div>
        </div>
          `
        );
      }
});


//Start the server 
app.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
})