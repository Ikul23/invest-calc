<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Отчет по проекту {{ $project_name }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: right;
        }

        th {
            background-color: #f2f2f2;
            text-align: center;
        }

        .text-left {
            text-align: left;
        }

        .metrics {
            margin-bottom: 20px;
        }

        .metric {
            display: inline-block;
            margin-right: 30px;
        }
    </style>
</head>

<body>
    <h1>Отчет по проекту: {{ $project_name }}</h1>

    <div class="metrics">
        <div class="metric"><strong>NPV:</strong> {{ number_format($metrics->npv, 2) }} ₽</div>
        <div class="metric"><strong>IRR:</strong> {{ number_format($metrics->irr, 2) }}%</div>
        <div class="metric"><strong>DPBP:</strong> {{ number_format($metrics->dpbp, 2) }} лет</div>
    </div>

    <table>
        <thead>
            <tr>
                <th class="text-left">Год</th>
                <th>Выручка</th>
                <th>OPEX</th>
                <th>CAPEX</th>
                <th>Амортизация</th>
                <th>EBT</th>
                <th>Налог</th>
                <th>Чистая прибыль</th>
                <th>ЧОК</th>
                <th>Денежный поток</th>
                <th>NPV</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($cashflows as $row)
                <tr>
                    <td class="text-left">{{ $row->year }}</td>
                    <td>{{ number_format($row->revenue, 2) }} ₽</td>
                    <td>{{ number_format($row->opex, 2) }} ₽</td>
                    <td>{{ number_format($row->capex, 2) }} ₽</td>
                    <td>{{ number_format($row->depreciation, 2) }} ₽</td>
                    <td>{{ number_format($row->ebit, 2) }} ₽</td>
                    <td>{{ number_format($row->tax, 2) }} ₽</td>
                    <td>{{ number_format($row->net_income, 2) }} ₽</td>
                    <td>{{ number_format($row->working_capital, 2) }} ₽</td>
                    <td>{{ number_format($row->cashflow, 2) }} ₽</td>
                    <td>{{ number_format($row->npv, 2) }} ₽</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
