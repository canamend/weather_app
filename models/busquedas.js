const axios = require('axios');
const fs = require('fs')

class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map( item => {
            let palabras = item.split(" ");
            palabras = palabras.map( word  => word[0].toUpperCase() + word.substring(1) )
            return palabras.join(" ");
        })
    }

    get ParamsMapbox () {
        return {
            language : 'es',
            access_token : process.env.MAPBOX_KEY,
        }
    }

    get ParamsOpenWeather () {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudades( lugar = '' ) {
        try{
            const instance = axios.create({
               baseURL : `https://api.mapbox.com/search/geocode/v6/forward?`,
               params: { ...this.ParamsMapbox, q : lugar},
            });

            const resp = await instance.get();
            return resp.data.features.map(feature => ({
                id : feature.id,
                lng: feature.properties.coordinates.longitude,
                lat: feature.properties.coordinates.latitude,
                name: `${feature.properties.name}, ${feature.properties.place_formatted}`,
            }));

        } catch ( error ){
            console.log(error); //TODO retornar los lugares
        }
    }

    async clima( lat='', lon='' ){
        try{
            const instance = axios.create({
                baseURL : `https://api.openweathermap.org/data/2.5/weather?`,
                params: { ...this.ParamsOpenWeather, lat, lon},
            });
            
            const resp = await instance.get();

            const { weather, main } = resp.data;
            return {    
                    desc: weather[0].description, 
                    temp: main.temp, 
                    min: main.temp_min, 
                    max: main.temp_max  
                }
        }catch( err ){
            console.log(err);
        }
    }

    agregarHistorial( lugar = '' ){
        if( this.historial.includes( lugar.toLocaleLowerCase() )){
            return;
        }
        this.historial.unshift( lugar.toLocaleLowerCase() );
        if(this.historial.length > 5) this.historial.pop();
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync( this.dbPath, JSON.stringify(payload))
    }

    leerDB() {
        if( !fs.existsSync(this.dbPath) ) return null;

        const info = fs.readFileSync( this.dbPath, {encoding: 'utf-8'} )
        const data = JSON.parse(info);
        this.historial = data.historial;
    }
}

module.exports = Busquedas;