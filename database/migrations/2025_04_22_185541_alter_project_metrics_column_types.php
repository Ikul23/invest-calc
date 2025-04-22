<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterProjectMetricsColumnTypes extends Migration
{
    public function up()
    {
        Schema::table('project_metrics', function (Blueprint $table) {
            $table->decimal('depreciation_total', 20, 4)->change();
            $table->decimal('ebit_total', 20, 4)->change();
            $table->decimal('net_income_total', 20, 4)->change();
            $table->decimal('working_capital_total', 20, 4)->change();
            $table->decimal('initial_investment', 20, 4)->change();
            $table->decimal('cumulative_cashflow', 20, 4)->change();
            $table->decimal('npv', 20, 4)->change();
            $table->decimal('irr', 20, 4)->change();
            $table->decimal('dpbp', 20, 4)->change();
        });
    }

    public function down()
    {
        Schema::table('project_metrics', function (Blueprint $table) {
            // Только если нужно вернуть обратно, иначе оставь пустым
        });
    }
}
