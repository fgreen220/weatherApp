const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const https = require('https')
const app = express()
const db = require('./queries')
const port = process.env.PORT;
if (port == null || port == "") {
  port = 5001;
}
const { config } = require('./config');

app.use(bodyParser.json({limit:'50mb'}))
app.use(
  bodyParser.urlencoded({
    limit:'50mb',
    extended: true,
  })
)
app.use(cors())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
})

app.get('/', (request, response) => {
  response.json({ info: 'Weather App API'})
})

app.get('/currentWeather', (request, response) => {
  let { zip, country, city} = request.headers;
  if(zip.split('').filter(char => char === ' ').length >=1 || zip === '99999' || zip.includes('-')){
    https.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${config.openWeatherKey}&lang=en
    `, resp => {
      let data = '';
      resp.on('data', chunk => {
        data += chunk;
      })
      
      resp.on('end', () => {
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify(data));
      })
    })
    .on('error', err => {
      console.log('Error: ', + err.message);
    })
  } else {
    https.get(`https://api.openweathermap.org/data/2.5/weather?zip=${zip},${country}&appid=${config.openWeatherKey}&lang=en
    `, resp => {
      let data = '';
  
      resp.on('data', chunk => {
        data += chunk;
      })
  
      resp.on('end', () => {
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify(data));
      })
    })
    .on('error', err => {
      console.log('Error: ', + err.message);
    }) 
  }

})

app.get('/darkSky', (request, response) => {
  let { latitude, longitude } = request.headers;

  https.get(`https://api.darksky.net/forecast/${config.darkSkyKey}/${latitude},${longitude}?lang=en&units=us`
  , resp => {
    let data = '';

    resp.on('data', chunk => {
      data += chunk;
    })

    resp.on('end', () => {
      response.setHeader('Content-Type', 'application/json');
      response.send(JSON.stringify(data));
    })
  })
  .on('error', err => {
    console.log('Error: ', + err.message);
  })
})

app.get('/airData', (request, response) => {
  let { latitude, longitude, averagingperiod, parameter } = request.headers;
  https.get(`https://api.openaq.org/v1/measurements?limit=${averagingperiod}&coordinates=${latitude},${longitude}&order_by=distance&parameter=${parameter}&include_fields=averagingPeriod&radius=80500
  `, resp => {
    let data = '';

    resp.on('data', chunk => {
      data += chunk;
    })

    resp.on('end', () => {
      response.setHeader('Content-Type', 'application/json');
      response.send(JSON.stringify(data));
    })
  })
  .on('error', err => {
    console.log('Error', + err.message);
  })
})

app.get('/autocomplete', (request, response) => {
  let { query } = request.headers;
  https.get(`https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json?apiKey=${config.autoCompleteApiKey}&query=${query}&language=en&resultType=city&maxresults=20`, resp => {
    let data = '';

    resp.on('data', chunk => {
      data += chunk;
    })

    resp.on('end', () => {
      response.setHeader('Content-Type', 'application/json');
      response.send(JSON.stringify(data));
    })
  })
  .on('error', err => {
    console.log('Error: ', + err.message);
  })
})

app.get('/users', db.getUsers)
app.get('/login', db.getUsers)
app.post('/signup', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.listen(port, () => {
  console.log(`App running on port ${port}!`)
});