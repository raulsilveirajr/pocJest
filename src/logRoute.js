const express = require('express');
const { queryParser } = require('express-query-parser')

function logRoutes(req, res, next) {
  const { method, url } = req;
  console.log(`[${method.toUpperCase()}] ${url}`);
  return next();
}

module.exports = logRoutes;
