// Global object with headers, titles, etc. Uses language

export const titles = (language, thisTitle) => {
    const theTitles = {
        "HR_ELIGIBLE": {
            en: 'Eligible Home Repair Programs',
            es: 'Programas de reparación de viviendas elegibles'
        },
        "HR_PROGRAM": {
            en: 'Repair Program',
            es: 'Programa de Reparación'
        },
        "HR_WAITLIST": {
            en: 'Waitlist',
            es: 'lista de espera'
        },
        "HR_PROCEED": {
            en: 'Proceed with application',
            es: 'Proceder con la aplicación'
        }, 
        "HR_CANCEL": {
            en: 'Cancel',
            es: 'Cancelar'
        },
        "AP_EMERGENCY": {
            en: 'Continue application as a NON EMERGENCY.',
            es: 'Continúe con la aplicación como NO EMERGENCIA.'
        },
        "GA_ADDRESS": {
            en: 'Provide the address of the home',
            es: 'Proporcione la dirección de la casa'
        },  
        "GA_YOUR": {
            en: 'Your address...',
            es: 'Su dirección...'
        },  
        "GA_REENTER": {
            en: 'Please reenter the address and select it from the list!',
            es: '¡Vuelva a ingresar la dirección y selecciónela de la lista!'
        },    
        "QP_ANSWER": {
            en: 'Please answer the questions:',
            es: 'Por favor responda las preguntas:'
        },   
        "QP_SIZE": {
            en: 'Family Size',
            es: 'Tamaño de la familia'
        },  
        "QP_INCOME": {
            en: 'Maximum Income',
            es: 'Renta máxima'
        },   
        "RL_BUTTON": {
            en: 'Select the needed repairs -> Click when Done',
            es: 'Seleccione las reparaciones necesarias -> Haga clic cuando esté listo'
        },    
        "RL_ALERT": {
            en: 'You must select one or more repairs!',
            es: '¡Debe seleccionar una o más reparaciones!'
        },                                                          
    }
    return theTitles[thisTitle][language]
}