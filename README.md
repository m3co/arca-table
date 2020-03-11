
# ARCA-Table

## Introduccion

La plataforma `ARCA` es un desarrollo complejo, el cual contiene soluciones específicas para las empresas constructoras, comenzando con la planeación del presupuesto hasta el control de obra.

Sus inicios se dan a partir de la construcción de un edificio piloto en Colombia de 16 apartamentos, proyecto financiado con recursos propios, para el año de 2014. El desarrollo de `ARCA` estaba en aquel entonces conformado por un equipo áltamente competitivo, localizado especialmente en Moscú. Los resultados fueron de álto impacto positivo para la productividad de la obra.

A partir de la versión inicial se invirtieron esfuerzos y tiempo para realizar la segunda versión de la plataforma `ARCA`. En ésta segunda versión estan presentes mejoras encaminadas a la estrategias de utilización de datos directamente desde _REVIT_ y a la distribución horizontal de los servidores `ARCA`.

## Rationale

Durante del desarrollo de las aplicaciones administrativas se encontró que para cada aplicación se escribía un módulo independiente para el manejo de tablas.

Se pretende realizar un módulo en `ReactJS` que permita dibujar cualquier tabla con miras a unificar el comportamiento de las tablas.

## Requerimientos

Table es el módulo que responde por el dibujado de las tablas. Es requerido para mostrar en web.

La información a mostrar proviene de la plataforma `ARCA` la cual entrega información en formato `JSON-pseudo-RPC` vía [ARCA-Redux](https://github.com/m3co/arca-redux). Dicha plataforma entrega los datos en _tiempo real_.

Por lo tanto, los requerimientos para éste módulo son:
- Permitir mostrar una tabla utilizando `ARCA-Redux`
- Realizar `CRUD` sobre los datos, con la posibilidad de desactivar ciertas acciones. E.g. desactivar `C` que significaría desactivar `Create`
- Customizar la forma de entrada de datos dependiendo del campo a procesar. E.g. definir que un campo determinado es de tipo `checkbox`
- Manipular de la entrada de datos en cada campo _In-Cell_ asegurando que dos celdas al mismo tiempo no pueden ser redactadas.
- Mostrar posibles errores en forma de notificaciones
- Permitir customizar los nombres de las columnas
- Realizar filtro sobre los datos
- Realizar orden por columnas
