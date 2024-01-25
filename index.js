import express from "express";
import { serve, setup } from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const app = express();

const swaggerJsdocOptions = {
  definition: {
    openapi: '3.0.0',
    servers: [
      {
        url: "http://localhost:3000",
        filter: true,
      }
    ],
    info: {
      title: 'Documentation',
      description: "Documentation regarding the various queries",
      version: '1.0.0',
    },
  },
  apis: ['./*.js'], 
};

const swaggerSpec = swaggerJSDoc(swaggerJsdocOptions);

const options = {
  explorer: true,
  swaggerOptions: {
    url: 'http://localhost:3000/'
  }
}

app.use("/docs", serve, setup(swaggerSpec, options))

/**
 * @swagger
 * /:
 *  get:
 *    summary: Landing page of the website
 *    description: It is the first page that gets displayed
 *    responses:  
 *      "200": 
 *        description: Return "Hello world" displayed on the page.
 */

app.get("/", (req, res) => {
  res.send("Hello world");
})

/**
 * @swagger
 * /user/{id}:
 *  get:
 *    summary: Fetch the user Id
 *    description: This api endpoint returns the id of the user
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: Id of the user
 *        schema:   
 *          type: integer
 *      
 *    responses:
 *      '200':
 *        description: Id parsed from the path is displayed back on the screen.
 *        content:
 *          text:
 *            schema:
 *              type: string
 *      '400':
 *        description: If the parsed Id is not a valid id, error is rendered.
 *        content:
 *          text:
 *            schema:
 *              type: string
 */

app.get("/user/:id", (req, res) => {
  const id = req.params.id;

  if(id <= 1200) {
    return res.status(400).send("Invalid id");
  }

  res.status(200).send(`Your name is ${id}`);
})

const array = [
  {
    id: "1200",
    description: "twelve hundred",
  },
  {
    id: "1300",
    description: "thirteen hundred",
  },
  {
    id: "1400",
    description: "fourteen hundred",
  },
  {
    id: "1500",
    description: "fifteen hundred",
  },
  {
    id: "1600",
    description: "sixteen hundred",
  },
]

/**
 * @swagger
 * /retrieve:
 *  get:
 *    summary: Retrieve all the orders
 *    description: This api endpoint returns all the orders based on authentication id provided.
 *    parameters:
 *      - in: query
 *        name: auth
 *        schema: 
 *          type: string
 *    responses:
 *      "200":  
 *        description: Returns the array if the user is authorized
 *        content:
 *          application/json:
 *            schema: 
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  description:
 *                    type: string
 *      "401":
 *        description: Returns error if the user is unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 */
app.get("/retrieve", (req, res) => {
  const {auth} = req.query;

  if(!auth) {
    return res.status(401).send({error: "Unauthorized"});
  }

  return res.status(200).json(array);
})

/**
 * @swagger
 * /add/{id}:
 *  post:
 *    summary: Adds a new book
 *    description: This route adds a new book to the list
 *    parameters:
 *      - in: path
 *        name: id
 *        schema: 
 *          type: integer
 *        required: true
 *    responses:
 *      '200':  
 *        description: returns the new array
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items: 
 *                type: object
 *                properties:
 *                  id: 
 *                    type: string
 *                  description:
 *                    type: string
 *              
 */
app.post("/add/:id", (req, res) => {
  const id = req.params.id;

  console.log(typeof(id));

  array.push({
    id, 
    description: "New book",
  });

  return res.status(200).json(array);
})

app.listen(3000, () => {
  console.log("Server is running")
})
