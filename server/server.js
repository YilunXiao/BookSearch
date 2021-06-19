const express = require('express');
// Require apollo-server-express
const { ApolloServer } = require('apollo-server-express')
const path = require('path');

// get typedef and resolver files
const { typeDefs, resolvers } = require('./schemas');
// get middleware for authorizations
const { authMiddleware } = require('./utils/auth');

const db = require('./config/connection');

// ROUTES NOT NEEDED WITH APOLLO SERVER
// const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Create new instance of apollo server
const server = new ApolloServer({
  // Pass middleware as arguments
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// pass express app to server as middleware
server.applyMiddleware({ app });


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// NOT REQUIRED WITH APOLLO SERVER
// app.use(routes);

// Apollo route?
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`)
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
