<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <title>Отчет по проекту</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #999;
            padding: 8px;
            text-align: center;
        }

        th {
            background-color: #eee;
        }

        h2,
        h3 {
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <h2>Отчет по проекту: {{ $data['project_name'] }}</h2>

    <h3>Финансовые метрики:</h3>
    <ul>
        <li><strong>NPV:</strong> {{ number_format($data['metrics']['npv'], 2, ',', ' ') }} ₽</li>
        <li><strong>IRR:</strong> {{ $data['metrics']['irr'] }}%</li>
        <li><strong>DPBP:</strong> {{ $data['metrics']['dpbp'] }} лет</li>
    </ul>

    <h3>Денежные потоки:</h3>
    <table>
        <thead>
            <tr>
                <th>Год</th>
                <th>Выручка</th>
                <th>OPEX</th>
                <th>CAPEX</th>
                <th>EBT</th>
                <th>Налог (25%)</th>
                <th>Чистый поток</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data['cashflow'] as $row)
                <tr>
                    <td>{{ $row['year'] }}</td>
                    <td>{{ number_format($row['revenue'], 0, ',', ' ') }}</td>
                    <td>{{ number_format($row['opex'], 0, ',', ' ') }}</td>
                    <td>{{ number_format($row['capex'], 0, ',', ' ') }}</td>
                    <td>{{ number_format($row['ebt'], 0, ',', ' ') }}</td>
                    <td>{{ number_format($row['tax'], 0, ',', ' ') }}</td>
                    <td>{{ number_format($row['cashflow'], 0, ',', ' ') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <footer style="margin-top: 40px; font-size: 12px; text-align: center;">
        Контакты: kompaniya.gisplyus@bk.ru | Telegram: @ikul23
    </footer>
</body>

</html>
