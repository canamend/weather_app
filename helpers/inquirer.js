const inquirer = require('inquirer');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`,
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`,
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`,
            },
        ]
    }
];

const inquireMenu = async () => {
    console.clear();
    console.log('=========================='.green);
    console.log( 'Seleccione una opción ');
    console.log('==========================\n'.green);

    const { opcion } = await inquirer.prompt(questions);

    return opcion;
}

const pausa = async() => {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${ 'ENTER'.green } para continuar.`
        }

    ]
    console.log('\n');
    await inquirer.prompt(question);
}

const leerInput = async( message ) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if( value.length === 0 ) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);
    return desc;

}

const listarLugares = async(lugares = {}) => {
    const choices = lugares.map( (lugar, i) => {
        
        const idx = `${ i +1 }`.green;

        return {
            value: lugar.id,
            name: `${ idx } ${ lugar.name }`,

        }
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]

    choices.unshift({
        value: '0',
        name: 'Cancelar',
    });
    const { id } = await inquirer.prompt(preguntas);
    return id;
}

const mostrarListadoChecks = async(todos) => {
    const choices = todos.map( (todo, i) => {
        
        const idx = `${ i +1 }`.green;

        return {
            value: todo.id,
            name: `${ idx } ${ todo.desc }`,
            checked: ( todo.completadoEn ) ? true : false,
        }
    });

    const preguntas = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ]

    const { ids } = await inquirer.prompt(preguntas);
    return ids;


}

const confirmar = async(message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const { ok } = await inquirer.prompt(question);
    return ok;
}


module.exports = {
    inquireMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecks,
}