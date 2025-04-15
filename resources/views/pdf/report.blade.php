<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>{{ $project_name }} - Financial Report</title>
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
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }
    </style>
</head>

<body>
    <h1>{{ $project_name }}</h1>

    <h2>Financial Metrics</h2>
    <ul>
        <li>NPV: {{ $metrics->npv }}</li>
        <li>IRR: {{ $metrics->irr }}%</li>
        <li>Payback Period: {{ $metrics->pp }} years</li>
    </ul>

    <h2>Cashflow Data</h2>
    <table>
        <thead>
            <tr>
                <th>Year</th>
                <th>Revenue</th>
                <th>OPEX</th>
                <th>CAPEX</th>
                <th>NPV</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($cashflows as $item)
                <tr>
                    <td>{{ $item->year }}</td>
                    <td>{{ $item->revenue }}</td>
                    <td>{{ $item->opex }}</td>
                    <td>{{ $item->capex }}</td>
                    <td>{{ $item->npv }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
