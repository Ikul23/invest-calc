<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNEWColumnsToInputDataTable extends Migration
{
    public function up()
    {
        Schema::table('input_data', function (Blueprint $table) {
            $table->decimal('depreciation', 15, 2)->default(0)->after('revenue');
            $table->decimal('ebit', 15, 2)->default(0)->after('depreciation');
            $table->decimal('tax', 15, 2)->default(0)->after('ebit');
            $table->decimal('net_income', 15, 2)->default(0)->after('tax');
            $table->decimal('working_capital', 15, 2)->default(0)->after('net_income');
            $table->decimal('cashflow', 15, 2)->default(0)->after('working_capital');
            $table->decimal('npv', 15, 2)->default(0)->after('cashflow');
        });
    }

    public function down()
    {
        Schema::table('input_data', function (Blueprint $table) {
            $table->dropColumn([
                'depreciation',
                'ebit',
                'tax',
                'net_income',
                'working_capital',
                'cashflow',
                'npv'
            ]);
        });
    }
}
