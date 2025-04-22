<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('project_metrics', function (Blueprint $table) {
            $table->decimal('depreciation_total', 14, 4)->change();
            $table->decimal('ebit_total', 14, 4)->change();
            $table->decimal('net_income_total', 14, 4)->change();
            $table->decimal('working_capital_total', 14, 4)->change();
            $table->decimal('initial_investment', 14, 4)->change();
            $table->decimal('average_tax_rate', 5, 2)->change();
            $table->decimal('cumulative_cashflow', 14, 4)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_metrics', function (Blueprint $table) {
            //
        });
    }
};
