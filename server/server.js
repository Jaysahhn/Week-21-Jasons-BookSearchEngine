const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes'); unnecessary for graphql api

const { ApolloServer } = require("@apollo/server");
const { authMiddleware } = require("./utils/auth");
const { typeDefs, resolvers } = require("./schemas");



const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

// app.use(routes);
startApolloServer(typeDefs, resolvers);


