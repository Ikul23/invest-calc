<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Финансовый отчёт</title>
    <style>
        body {
            font-family: sans-serif;
        }

        table,
        th,
        td {
            border: 1px solid black;
            border-collapse: collapse;
        }

        th,
        td {
            padding: 6px;
            text-align: center;
        }

        .footer {
            font-size: 12px;
            margin-top: 30px;
            text-align: center;
            color: #555;
        }
    </style>
</head>

<body>
    <h2>{{ $project_name }}</h2>

    <h4>Таблица DCF</h4>
    <table>
        <tr>
            <th>Год</th>
            <th>Денежный поток</th>
        </tr>
        @foreach ($cashFlows as $year => $cf)
            <tr>
                <td>{{ $year + 1 }}</td>
                <td>{{ number_format($cf, 2, ',', ' ') }}</td>
            </tr>
        @endforeach
    </table>

    <p><strong>NPV:</strong> {{ $npv }}</p>
    <p><strong>IRR:</strong> {{ $irr }}%</p>
    <p><strong>DPBP:</strong> {{ $dpbp }} лет</p>

    <div class="footer">
        © 2025 ИнвестКальк. Контакты: kompaniya.gisplyus@bk.ru | Telegram: @ikul23
    </div>
</body>

</html>
