const request = require('supertest');
const expect = require('expect');
const jwt = require('jsonwebtoken');

const { app } = require('./../app');
const { allEvents } = require('./seed/eventData');

