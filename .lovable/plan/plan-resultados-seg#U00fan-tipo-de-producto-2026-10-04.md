# Plan: resultados según tipo de producto

## Objetivo
Hacer que cada análisis distinga claramente entre maquillaje, skincare y otros cosméticos, mostrando solo información útil para esa categoría y eliminando toda puntuación.

## Cambios
- Clasificar cada producto como `makeup`, `skincare` u `other` durante el análisis con IA.
- Ajustar la respuesta de IA para priorizar beneficios y cualidades destacadas de cada producto, sin inventar datos que no puedan inferirse de la imagen.
- Para **maquillaje**, mostrar exclusivamente una sección de tono y acabado, incluyendo la línea de tonos del producto en nombres y muestras visuales.
- Para **skincare**, mostrar exclusivamente la compatibilidad por tipo de piel y recomendaciones de uso.
- Para otros cosméticos, mantener beneficios y veredicto sin mostrar bloques de maquillaje o skincare.
- Eliminar la puntuación numérica y sus círculos tanto del resultado principal como del veredicto final.
- Mantener el aviso de que el análisis es orientativo y adaptar el diseño a móvil y escritorio.

## Detalles técnicos
- Actualizar el formato tipado del resultado para incluir categoría y tonos de maquillaje, y retirar los campos de puntuación.
- Modificar las instrucciones del análisis de imagen para devolver campos específicos según categoría.
- Renderizar condicionalmente cada bloque en la pantalla de resultados y añadir estilos para una línea de tonos variable.
- Probar un resultado de maquillaje y uno de skincare, además de verificar que la app compile sin errores.
