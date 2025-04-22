<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('project_metrics', function (Blueprint $table) {
            $table->decimal('depreciation_total')->nullable();
            $table->decimal('ebit_total')->nullable();
            $table->decimal('net_income_total')->nullable();
            $table->decimal('working_capital_total')->nullable();
            $table->decimal('initial_investment')->nullable();
            $table->decimal('average_tax_rate')->nullable();
            $table->decimal('cumulative_cashflow')->nullable();
        });
    }

    public function down()
    {
        Schema::table('project_metrics', function (Blueprint $table) {
            $table->dropColumn([
                'depreciation_total',
                'ebit_total',
                'net_income_total',
                'working_capital_total',
                'initial_investment',
                'average_tax_rate',
                'cumulative_cashflow',
            ]);
        });
    }
};
