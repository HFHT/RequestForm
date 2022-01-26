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
        "GA_GOTADDRESS": {
            en: 'Address of the home:',
            es: 'Dirección de la casa'
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
        "CA_NAME": {
            en: 'Name',
            es: 'Nombre'
        }, 
        "CA_YOURNAME": {
            en: 'Your name',
            es: 'Tu nombre'
        }, 
        "CA_PHONE": {
            en: 'Phone',
            es: 'Teléfono'
        },     
        "CA_PHONENUMBER": {
            en: '(520) 555-1212',
            es: '(520) 555-1212'
        },     
        "CA_ALTPHONE": {
            en: 'Alternate Phone',
            es: 'Teléfono alternativo'
        },     
        "CA_ALTPHONENUMBER": {
            en: '(520) 555-1212',
            es: '(520) 555-1212'
        },   
        "CA_EMAIL": {
            en: 'Email',
            es: 'Correo electrónico'
        }, 
        "CA_EMAILADDR": {
            en: 'Email address',
            es: 'Dirección de correo electrónico'
        },    
        "CA_GENDER": {
            en: 'Gender',
            es: 'Género'
        }, 
        "CA_GENFEMALE": {
            en: 'Female',
            es: 'Mujer'
        },   
        "CA_GENMALE": {
            en: 'Male',
            es: 'Masculino'
        }, 
        "CA_GENNA": {
            en: 'Rather not say',
            es: 'Prefiero no decirlo'
        },    
        "CA_MARITAL": {
            en: 'Marital Status',
            es: 'Prefiero no decirlo'
        },  
        "CA_MSMARRIED": {
            en: 'Married',
            es: 'Casada'
        },  
        "CA_MSSINGLE": {
            en: 'Single',
            es: 'Única'
        },  
        "CA_MSDIVORCED": {
            en: 'Divorced',
            es: 'Divorciada'
        },  
        "CA_MSSEPERATED": {
            en: 'Seperated',
            es: 'Separadas'
        },  
        "CA_MSWIDOWED": {
            en: 'Widowed',
            es: 'Viuda'
        },  
        "CA_MILBRANCH": {
            en: 'Military Service',
            es: 'Servicio militar'
        },  
        "CA_MBARMY": {
            en: 'Army',
            es: 'Ejército'
        },  
        "CA_MBMARINE": {
            en: 'Marine',
            es: 'Marino'
        },  
        "CA_MBNAVY": {
            en: 'Navy',
            es: 'Armada'
        },  
        "CA_MBAIRFORCE": {
            en: 'Air Force',
            es: 'Fuerza Aerea'
        },  
        "CA_MBSPACEFORCE": {
            en: 'Space Force',
            es: 'Fuerza Espacial'
        },  
        "CA_MBCOASTGUARD": {
            en: 'Coast Guard',
            es: 'Guardacostas'
        },  
        "CA_MBNATIONALGUARD": {
            en: 'National Guard',
            es: 'Guardia Nacional'
        },  
        "CA_MBUNKNOWN": {
            en: 'Unknown',
            es: 'Desconocido'
        },  
        "CA_MBSELECTALL": {
            en: 'Select all that apply',
            es: 'Seleccione todas las que correspondan'
        }, 
        "CA_MSDATES": {
            en: 'Service Dates',
            es: 'Fechas de Servicio'
        }, 
        "CA_MSDATESEXAMPLE": {
            en: 'for example: 1972-1976',
            es: 'por ejemplo: 1972-1976'
        }, 
        "CA_BIRTHYEAR": {
            en: 'Year of Birth',
            es: 'Año de nacimiento'
        }, 
        "CA_BUTTON": {
            en: 'Fill out this form -> Click when Done',
            es: 'Complete este formulario -> Haga clic cuando haya terminado'
        }, 

    }
    return theTitles[thisTitle][language]
}