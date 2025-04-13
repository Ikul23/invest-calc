<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <title>{{ $project_name }} — отчет</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 5px;
            text-align: center;
        }
    </style>
</head>

<body>
    <h2>Отчет по проекту: {{ $project_name }}</h2>

    <table>
        <thead>
            <tr>
                <th>Год</th>
                <th>Выручка</th>
                <th>OPEX</th>
                <th>CAPEX</th>
                <th>EBT</th>
                <th>Налог</th>
                <th>Чистый поток</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($cashflow as $row)
                <tr>
                    <td>{{ $row['year'] }}</td>
                    <td>{{ $row['revenue'] }}</td>
                    <td>{{ $row['opex'] }}</td>
                    <td>{{ $row['capex'] }}</td>
                    <td>{{ $row['ebt'] }}</td>
                    <td>{{ $row['tax'] }}</td>
                    <td>{{ $row['cashflow'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <h4>Финансовые метрики:</h4>
    <ul>
        <li>NPV: {{ $metrics['npv'] }}</li>
        <li>IRR: {{ $metrics['irr'] }}%</li>
        <li>DPBP: {{ $metrics['dpbp'] }} лет</li>
        <li>Ставка дисконтирования: {{ $metrics['discountRate'] }}%</li>
        <li>Налог на прибыль: {{ $metrics['taxRate'] }}%</li>
    </ul>
</body>

</html>
