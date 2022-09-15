<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('private_posts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('send_user_id');
            $table->unsignedBigInteger('receive_user_id');
            $table->foreign('send_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('receive_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->text("text");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('private_posts');
    }
};
