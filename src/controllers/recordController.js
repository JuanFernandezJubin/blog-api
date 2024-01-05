const db = require('../db/index.json');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'db', 'index.json');


const getAllRecordsForWorkout = (req, res) => {
  try {
    // Lee el archivo index.json
    const data = fs.readFileSync(dbPath, 'utf8');
    const records = JSON.parse(data).records; // Suponiendo que 'records' es el arreglo en index.json

    return res.status(200).json({
      status: 'OK',
      data: records,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'FAILED',
      data: { error: error.message || error },
    });
  }
};

const getRecordForWorkout = (req, res) => {
  const {
    params: { recordId },
  } = req;

  if (!recordId) {
    return res.status(400).send({
      status: "FAILED",
      data: { error: "Parameter ':recordId' can not be empty" },
    });
  }

  try {
    const record = db.records.find((record) => record.id === Number(recordId));
    return res.status(200).json({
        status: "OK",
        data: record,
    });
  } catch (error) {
    return res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const createRecordForWorkout = (req, res) => {
  const {
    body: { date, duration, distance },
  } = req;

  if (!date || !duration || !distance) {
    return res.status(400).send({
      status: 'FAILED',
      data: { error: 'Parameters cannot be empty' },
    });
  }

  try {
    const newRecord = {
      id: uuidv4(), // Genera un nuevo UUID para el ID del registro
      date,
      duration,
      distance,
    };

    db.records.push(newRecord);

    // Armo la ruta para poder reescribir el json esto se va luego
    fs.writeFileSync(dbPath, JSON.stringify(db));

    return res.status(201).json({
      status: 'OK',
      data: newRecord,
    });
  } catch (error) {
    return res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};

const deleteRecordForWorkout = (req, res) => {
  const {
    params: { recordId },
  } = req;

  try {
    // Lee el archivo index.json
    const data = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(data);

    // Encuentra el índice del registro a eliminar en el array 'records'
    const index = db.records.findIndex(record => record.id === Number(recordId));

    if (index === -1) {
      return res.status(404).json({
        status: 'FAILED',
        data: { error: 'Record not found' },
      });
    }

    // Elimina el registro del array 'records'
    db.records.splice(index, 1);

    // Escribe los cambios de vuelta al archivo index.json
    fs.writeFileSync(dbPath, JSON.stringify(db));

    return res.status(200).json({
      status: 'OK',
      data: { message: 'Record deleted successfully' },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'FAILED',
      data: { error: error.message || error },
    });
  }
};


module.exports = {
  getAllRecordsForWorkout,
  getRecordForWorkout,
  createRecordForWorkout,
  deleteRecordForWorkout,
};