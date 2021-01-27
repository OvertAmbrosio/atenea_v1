export const listaReportes = {
  resumen: 'resporteResumen',
  detalleTecnicosGpon: 'reporteDetalleTecnicosGpon'
};

export const reporteResumen = `
<!doctype html>
<html lang="es">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * {
      font-family: sans-serif;
      /* Change your font family */
    }

    .content-table {
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 0.9em;
      min-width: 400px;
      border-radius: 5px 5px 0 0;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    }

    .content-table thead tr {
      background-color: #3498DB;
      color: #ffffff;
      text-align: left;
      font-weight: bold;
    }

    .content-table th,
    .content-table td {
      padding: 12px 15px;
    }

    .content-table tbody tr {
      border-bottom: 1px solid #dddddd;
    }

    .content-table tbody tr:nth-of-type(even) {
      background-color: #f3f3f3;
    }

    .content-table tbody tr:last-of-type {
      border-bottom: 2px solid #3498DB;
    }

    .content-table tbody tr.active-row {
      font-weight: bold;
      color: #3498DB;
    }
  </style>
</head>

<body style="padding: 1rem;">
  <h3>Resumen General</h3>
  <table class="content-table">
    <thead>
      <tr>
        <th>Negocio</th>
        <th>Liquidadas</th>
        <th>Pendientes</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {{#each data}}
      <tr key={{@index}}>
        <td>{{negocio}}</td>
        <td>{{completadas}}</td>
        <td>{{pendiente}}</td>
        <td>{{total}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
</body>

</html>
`;

export const reporteDetalleTecnicosGpon = `
<!doctype html>
<html lang="es">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * {
      font-family: sans-serif;
      /* Change your font family */
    }

    body {
      width: 1024px;
    }

    /* SEGUNDA TABLA */
    .content-table-2 {
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 0.78em;
      min-width: 400px;
      border-radius: 5px 5px 0 0;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    }

    .content-table-2 thead tr {
      background-color: #DC7633;
      color: #ffffff;
      text-align: left;
      font-weight: bold;
    }

    .content-table-2 th,
    .content-table-2 td {
      padding: 12px 15px;
    }

    .content-table-2 tbody tr {
      border-bottom: 1px solid #dddddd;
    }

    .content-table-2 tbody tr:nth-of-type(even) {
      background-color: #f3f3f3;
    }

    .content-table-2 tbody tr:last-of-type {
      border-bottom: 2px solid #DC7633;
    }

    .content-table-2 tbody tr.active-row {
      font-weight: bold;
      color: #DC7633;
    }
  </style>
</head>

<body style="padding: 1rem;">
  <h3>Detalle de Altas GPON</h3>
  <table class="content-table-2">
    <thead>
      <tr>
        <th style="width: 250px;">Tecnico</th>
        <th>Completadas</th>
        <th>Iniciado</th>
        <th>No Realizado</th>
        <th>Suspendido</th>
        <th>Pendiente</th>
        <th>Cancelado</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {{#each data}}
      <tr key={{@index}}>
        <td style="width: 350px;">{{tecnico}}</td>
        <td style="background-color: #9BB6C2;font-weight: 700;">{{completadas}}</td>
        <td style="background-color: #5DBE3F;font-weight: 700;">{{iniciado}}</td>
        <td>{{no_realizado}}</td>
        <td>{{suspendido}}</td>
        <td style="background-color: #EFFF12;font-weight: 700;">{{pendiente}}</td>
        <td>{{cancelado}}</td>
        <td>{{total}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
</body>

</html>
`;

export const reporteTcflAverias = `
<!doctype html>
<html lang="es">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * {
      font-family: sans-serif;
      /* Change your font family */
    }

    body {
      width: 1024px;
    }

    /* PRIMERA TABLA */
    .content-table-1 {
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 0.78em;
      min-width: 400px;
      border-radius: 5px 5px 0 0;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    }

    .content-table-1 thead tr {
      background-color:#943126;
      color: #ffffff;
      text-align: left;
      font-weight: bold;
    }

    .content-table-1 th,
    .content-table-1 td {
      padding: 12px 15px;
    }

    .content-table-1 tbody tr {
      border-bottom: 1px solid #dddddd;
    }

    .content-table-1 tbody tr:nth-of-type(even) {
      background-color: #f3f3f3;
    }

    .content-table-1 tbody tr:last-of-type {
      border-bottom: 2px solid#943126;
    }

    .content-table-1 tbody tr.active-row {
      font-weight: bold;
      color:#943126;
    }

    /* SEGUNDA TABLA */
    .content-table-2 {
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 0.78em;
      min-width: 400px;
      border-radius: 5px 5px 0 0;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    }

    .content-table-2 thead tr {
      background-color: #BB8FCE;
      color: #ffffff;
      text-align: left;
      font-weight: bold;
    }

    .content-table-2 th,
    .content-table-2 td {
      padding: 12px 15px;
    }

    .content-table-2 tbody tr {
      border-bottom: 1px solid #dddddd;
    }

    .content-table-2 tbody tr:nth-of-type(even) {
      background-color: #f3f3f3;
    }

    .content-table-2 tbody tr:last-of-type {
      border-bottom: 2px solid #BB8FCE;
    }

    .content-table-2 tbody tr.active-row {
      font-weight: bold;
      color: #BB8FCE;
    }
    /* TERCERA TABLA */
    .content-table-3 {
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 0.78em;
      min-width: 400px;
      border-radius: 5px 5px 0 0;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    }

    .content-table-3 thead tr {
      background-color: #229954;
      color: #ffffff;
      text-align: left;
      font-weight: bold;
    }

    .content-table-3 th,
    .content-table-3 td {
      padding: 12px 15px;
    }

    .content-table-3 tbody tr {
      border-bottom: 1px solid #dddddd;
    }

    .content-table-3 tbody tr:nth-of-type(even) {
      background-color: #f3f3f3;
    }

    .content-table-3 tbody tr:last-of-type {
      border-bottom: 2px solid #229954;
    }

    .content-table-3 tbody tr.active-row {
      font-weight: bold;
      color: #229954;
    }
  </style>
</head>

<body style="padding: 1rem;">
  <h3>Reporte TCFL - Averias</h3>
  <table class="content-table-1">
    <thead>
      <tr>
        <th style="width: 200px;">Bucket</th>
        <th>En Plazo</th>
        <th>Vencidas</th>
        <th>Porcentaje</th>
      </tr>
    </thead>
    <tbody>
      {{#each buckets}}
      <tr key={{@index}}>
        <td style="width: 200px;">{{nombre}}</td>
        <td>{{en_plazo}}</td>
        <td>{{vencidas}}</td>
        <td style="{{style}}"><strong>{{porcentaje}} %</strong></td>
      </tr>
      {{/each}}
    </tbody>
  </table>
  <table class="content-table-2">
    <thead>
      <tr>
        <th style="width: 200px;">Contratas</th>
        <th>En Plazo</th>
        <th>Vencidas</th>
        <th>Porcentaje</th>
      </tr>
    </thead>
    <tbody>
      {{#each contratas}}
      <tr key={{@index}}>
        <td style="width: 200px;">{{nombre}}</td>
        <td>{{en_plazo}}</td>
        <td>{{vencidas}}</td>
        <td style="{{style}}">{{porcentaje}} %</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
  <table class="content-table-3">
    <thead>
      <tr>
        <th style="width: 200px;">Gestores</th>
        <th>En Plazo</th>
        <th>Vencidas</th>
        <th>Porcentaje</th>
      </tr>
    </thead>
    <tbody>
      {{#each gestores}}
      <tr key={{@index}}>
        <td style="width: 200px;">{{nombre}}</td>
        <td>{{en_plazo}}</td>
        <td>{{vencidas}}</td>
        <td style="{{style}}">{{porcentaje}} %</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
</body>

</html>
`;

export const reporteTcflAltas = `
<!doctype html>
<html lang="es">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * {
      font-family: sans-serif;
      /* Change your font family */
    }

    body {
      width: 1024px;
    }

    /* PRIMERA TABLA */
    .content-table-1 {
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 0.78em;
      min-width: 400px;
      border-radius: 5px 5px 0 0;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    }

    .content-table-1 thead tr {
      background-color:#943126;
      color: #ffffff;
      text-align: left;
      font-weight: bold;
    }

    .content-table-1 th,
    .content-table-1 td {
      padding: 12px 15px;
    }

    .content-table-1 tbody tr {
      border-bottom: 1px solid #dddddd;
    }

    .content-table-1 tbody tr:nth-of-type(even) {
      background-color: #f3f3f3;
    }

    .content-table-1 tbody tr:last-of-type {
      border-bottom: 2px solid#943126;
    }

    .content-table-1 tbody tr.active-row {
      font-weight: bold;
      color:#943126;
    }

    /* SEGUNDA TABLA */
    .content-table-2 {
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 0.78em;
      min-width: 400px;
      border-radius: 5px 5px 0 0;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    }

    .content-table-2 thead tr {
      background-color: #BB8FCE;
      color: #ffffff;
      text-align: left;
      font-weight: bold;
    }

    .content-table-2 th,
    .content-table-2 td {
      padding: 12px 15px;
    }

    .content-table-2 tbody tr {
      border-bottom: 1px solid #dddddd;
    }

    .content-table-2 tbody tr:nth-of-type(even) {
      background-color: #f3f3f3;
    }

    .content-table-2 tbody tr:last-of-type {
      border-bottom: 2px solid #BB8FCE;
    }

    .content-table-2 tbody tr.active-row {
      font-weight: bold;
      color: #BB8FCE;
    }
    /* TERCERA TABLA */
    .content-table-3 {
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 0.78em;
      min-width: 400px;
      border-radius: 5px 5px 0 0;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    }

    .content-table-3 thead tr {
      background-color: #229954;
      color: #ffffff;
      text-align: left;
      font-weight: bold;
    }

    .content-table-3 th,
    .content-table-3 td {
      padding: 12px 15px;
    }

    .content-table-3 tbody tr {
      border-bottom: 1px solid #dddddd;
    }

    .content-table-3 tbody tr:nth-of-type(even) {
      background-color: #f3f3f3;
    }

    .content-table-3 tbody tr:last-of-type {
      border-bottom: 2px solid #229954;
    }

    .content-table-3 tbody tr.active-row {
      font-weight: bold;
      color: #229954;
    }
  </style>
</head>

<body style="padding: 1rem;">
  <h3>Reporte Plazos 72 Horas</h3>
  <table class="content-table-1">
    <thead>
      <tr>
        <th style="width: 200px;">Bucket</th>
        <th>En Plazo</th>
        <th>Vencidas</th>
        <th>Porcentaje</th>
      </tr>
    </thead>
    <tbody>
      {{#each buckets}}
      <tr key={{@index}}>
        <td style="width: 200px;">{{nombre}}</td>
        <td>{{en_plazo}}</td>
        <td>{{vencidas}}</td>
        <td style="{{style}}"><strong>{{porcentaje}} %</strong></td>
      </tr>
      {{/each}}
    </tbody>
  </table>
  <table class="content-table-2">
    <thead>
      <tr>
        <th style="width: 200px;">Contratas</th>
        <th>En Plazo</th>
        <th>Vencidas</th>
        <th>Porcentaje</th>
      </tr>
    </thead>
    <tbody>
      {{#each contratas}}
      <tr key={{@index}}>
        <td style="width: 200px;">{{nombre}}</td>
        <td>{{en_plazo}}</td>
        <td>{{vencidas}}</td>
        <td style="{{style}}">{{porcentaje}} %</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
  <table class="content-table-3">
    <thead>
      <tr>
        <th style="width: 200px;">Gestores</th>
        <th>En Plazo</th>
        <th>Vencidas</th>
        <th>Porcentaje</th>
      </tr>
    </thead>
    <tbody>
      {{#each gestores}}
      <tr key={{@index}}>
        <td style="width: 200px;">{{nombre}}</td>
        <td>{{en_plazo}}</td>
        <td>{{vencidas}}</td>
        <td style="{{style}}">{{porcentaje}} %</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
</body>

</html>
`;

export const reporteProdDirectos = `
<!doctype html>
<html lang="es">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * {
      font-family: sans-serif;
      /* Change your font family */
    }

    body {
      width: 1024px;
    }

    /* PRIMERA TABLA */
    .content-table-1 {
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 0.78em;
      min-width: 400px;
      border-radius: 5px 5px 0 0;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    }

    .content-table-1 thead tr {
      background-color:#1F618D;
      color: #ffffff;
      text-align: left;
      font-weight: bold;
    }

    .content-table-1 th,
    .content-table-1 td {
      padding: 12px 15px;
    }

    .content-table-1 tbody tr {
      border-bottom: 1px solid #dddddd;
    }

    .content-table-1 tbody tr:nth-of-type(even) {
      background-color: #f3f3f3;
    }

    .content-table-1 tbody tr:last-of-type {
      border-bottom: 2px solid#1F618D;
    }

    .content-table-1 tbody tr.active-row {
      font-weight: bold;
      color:#1F618D;
    }
  </style>
</head>

<body style="padding: 1rem;">
  <h3>Reporte Producción Tecnicos Directos</h3>
  <table class="content-table-1">
    <thead>
      <tr>
        <th style="width: 300px;">Tecnico</th>
        <th>Averias</th>
        <th>Altas</th>
      </tr>
    </thead>
    <tbody>
      {{#each data}}
      <tr key={{@index}}>
        <td style="width: 300px;">{{tecnico}}</td>
        <td>{{averias}}</td>
        <td>{{altas}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
</body>

</html>
`;
