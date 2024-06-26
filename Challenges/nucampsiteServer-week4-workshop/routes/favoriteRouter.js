const express = require('express');
const Favorite = require('../models/favorite');
const Campsite = require('../models/campsite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('user')
            .populate('campsites')
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }).catch(err => next(err));
    })
    .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    const statusMessages = [];

                    const campsitePromises = req.body.map(request => {
                        return Campsite.findById(request._id)
                            .populate('comments.author')
                            .then(campsite => {
                                if (campsite) {
                                    if (!favorite.campsites.includes(campsite._id)) {
                                        favorite.campsites.push(campsite._id);
                                        statusMessages.push(`Successfully posted Campsite with id: ${campsite._id.toString()}`);
                                    } else {
                                        statusMessages.push(`Campsite with id: ${campsite._id.toString()} is already in the list.`);
                                    }
                                } else {
                                    statusMessages.push(`Error finding Campsite with id: ${request._id}.`);
                                }
                            });
                    });

                    Promise.all(campsitePromises)
                        .then(() => {
                            return favorite.save();
                        })
                        .then(savedFavorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({
                                statusMessages: statusMessages,
                                favorite: savedFavorite
                            });
                        })
                        .catch(err => next(err));
                } else {
                    Favorite.create({ user: req.user._id, campsites: req.body.map(campsite => campsite._id) })
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                }
            }).catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /campsites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    const response = {
                        statusMessages: `Successfully deleted favorites for user: ${req.user._id}.`,
                        favorite: favorite
                    };
                    res.json(response);
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('You do not have any favorites to delete.');
                }
            });
    });

favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /campsites');
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    const statusMessages = [];
                    Campsite.findById(req.params.campsiteId)
                        .populate('comments.author')
                        .then(campsite => {
                            if (campsite) {
                                if (!favorite.campsites.includes(campsite._id)) {
                                    favorite.campsites.push(campsite._id);
                                    favorite.save()
                                        .then(favorite => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            const response = {
                                                statusMessages: statusMessages,
                                                favorite: favorite
                                            };
                                            res.json(response);
                                        })
                                        .catch(err => next(err));
                                    statusMessages.push(`Successfully posted Campsite with id: ${campsite._id.toString()}`);
                                } else {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.end('That campsite is already a favorite!');
                                }
                            } else {
                                res.statusCode = 404;
                                res.setHeader('Content-Type', 'text/plain');
                                res.end(`Error finding Campsite with id: ${req.params.campsiteId}.`);
                            }
                        });
                } else {
                    Campsite.findById(req.params.campsiteId)
                        .populate('comments.author')
                        .then(campsite => {
                            if (campsite) {
                                Favorite.create({ user: req.user._id, campsites: [req.params.campsiteId] })
                                    .then(favorite => {
                                        if (favorite) {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(favorite);
                                        } else {
                                            res.statusCode = 404;
                                            res.setHeader('Content-Type', 'text/plain');
                                            res.end(`We have encountered an error at create.`);
                                        }
                                    });
                            } else {
                                res.statusCode = 404;
                                res.setHeader('Content-Type', 'text/plain');
                                res.end(`Error finding Campsite with id: ${req.params.campsiteId}.`);
                            }
                        });
                }
            });
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /campsites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    const index = favorite.campsites.indexOf(req.params.campsiteId);
                    if (index !== -1) {
                        // Remove the campsite from the campsites array
                        favorite.campsites.splice(index, 1);
                        // Save the updated favorite document
                        favorite.save()
                            .then(favorite => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            })
                            .catch(err => next(err));
                    } else {
                        // Campsite not found in favorites
                        res.statusCode = 404;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('Campsite not found in your favorites.');
                    }
                } else {
                    // No favorite document found for the user
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('You do not have any favorites to delete.');
                }
            });
    });

module.exports = favoriteRouter;
