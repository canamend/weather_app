require('dotenv').config();

const { leerInput, 
        inquireMenu, 
        pausa, 
        listarLugares
      } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async() =>{
    
    const busquedas = new Busquedas();
    let opt = 0;
    do{
        opt = await inquireMenu();
        
        switch(opt){
            case 1:

                //TODO: Mostrar msj
                const lugar = await leerInput('Ciudad: ');

                //TODO: Buscar lugares
                const lugares = await busquedas.ciudades( lugar );

                //TODO: Seleccionar el lugar
                const id = await listarLugares(lugares);
                if( id === '0' ) continue;

                const lugarSeleccionado = lugares.find( l => l.id == id );
                
                //TODO: Guardar en db
                busquedas.agregarHistorial( lugarSeleccionado.name );

                const { lat, lng } = lugarSeleccionado;
                //TODO: Clima
                const clima = await busquedas.clima(lat, lng);
                //Todo Mostrar resultados
                console.log('\nInformación de la ciudad:\n'.green);
                console.log('Ciudad:', lugarSeleccionado.name);
                console.log('Lat:', lat);
                console.log('Lng:', lng);
                console.log('Temperatura', clima.temp);
                console.log('Máxima', clima.min);
                console.log('Mínima', clima.max);
                console.log('El clima está con', clima.desc);

                break;

            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i +1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
                break;
            case 3:
                console.log({opt});
                break;

        }

        if( opt !== 0 ) await pausa();

    }while(opt !== 0);
}

main();
