-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."authors" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(500) NOT NULL,
    "slug" VARCHAR(500) NOT NULL,
    "short_description" TEXT,
    "biography" TEXT,
    "image" VARCHAR(500),
    "meta_title" VARCHAR(500),
    "meta_description" VARCHAR(500),
    "meta_keywords" VARCHAR(500),
    "views" INTEGER DEFAULT 0,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."authors_songs" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "author_id" BIGINT NOT NULL,
    "song_id" BIGINT NOT NULL,

    CONSTRAINT "authors_songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(500) NOT NULL,
    "slug" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "image" VARCHAR(500),
    "meta_title" VARCHAR(500),
    "meta_description" VARCHAR(500),
    "meta_keywords" VARCHAR(500),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories_songs" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "category_id" BIGINT NOT NULL,
    "song_id" BIGINT NOT NULL,

    CONSTRAINT "categories_songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."failed_jobs" (
    "id" BIGSERIAL NOT NULL,
    "uuid" VARCHAR(255) NOT NULL,
    "connection" TEXT NOT NULL,
    "queue" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "exception" TEXT NOT NULL,
    "failed_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "failed_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."favorite_playlists" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "user_id" BIGINT NOT NULL,
    "playlist_id" BIGINT NOT NULL,

    CONSTRAINT "favorite_playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."folder_song" (
    "id" BIGSERIAL NOT NULL,
    "folder_id" BIGINT NOT NULL,
    "song_id" BIGINT NOT NULL,

    CONSTRAINT "folder_song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."folders" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "name" VARCHAR(500) NOT NULL,
    "slug" VARCHAR(500) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."jobs" (
    "id" BIGSERIAL NOT NULL,
    "queue" VARCHAR(255) NOT NULL,
    "payload" TEXT NOT NULL,
    "attempts" SMALLINT NOT NULL,
    "reserved_at" INTEGER,
    "available_at" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."magic_link_codes" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "expires_at" TIMESTAMP(0) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "magic_link_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."migrations" (
    "id" SERIAL NOT NULL,
    "migration" VARCHAR(255) NOT NULL,
    "batch" INTEGER NOT NULL,

    CONSTRAINT "migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" UUID NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "notifiable_type" VARCHAR(255) NOT NULL,
    "notifiable_id" BIGINT NOT NULL,
    "data" TEXT NOT NULL,
    "read_at" TIMESTAMP(0),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."password_reset_tokens" (
    "email" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0),

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "public"."personal_access_tokens" (
    "id" BIGSERIAL NOT NULL,
    "tokenable_type" VARCHAR(255) NOT NULL,
    "tokenable_id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "token" VARCHAR(64) NOT NULL,
    "abilities" TEXT,
    "last_used_at" TIMESTAMP(0),
    "expires_at" TIMESTAMP(0),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "personal_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."playlist_song" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "playlist_id" BIGINT NOT NULL,
    "song_id" BIGINT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "tune" VARCHAR(50),

    CONSTRAINT "playlist_song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."playlists" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "owner_id" BIGINT,
    "uuid" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "is_collaborative" BOOLEAN NOT NULL DEFAULT false,
    "likes" INTEGER DEFAULT 0,
    "views" INTEGER DEFAULT 0,
    "shares" INTEGER DEFAULT 0,
    "slug" VARCHAR(500),

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posts" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "author_id" BIGINT NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "slug" VARCHAR(500) NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "image" VARCHAR(500),
    "live_date" TIMESTAMP(0),
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "meta_title" VARCHAR(500),
    "meta_description" VARCHAR(500),
    "meta_keywords" VARCHAR(500),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."seo" (
    "id" BIGSERIAL NOT NULL,
    "model_type" VARCHAR(255) NOT NULL,
    "model_id" BIGINT NOT NULL,
    "description" TEXT,
    "title" VARCHAR(255),
    "image" VARCHAR(255),
    "author" VARCHAR(255),
    "robots" VARCHAR(255),
    "canonical_url" VARCHAR(255),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "seo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."songs" (
    "deleted_at" TIMESTAMP(0),
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "exclude_from_search" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(500) NOT NULL,
    "slug" VARCHAR(500) NOT NULL,
    "short_description" TEXT,
    "lyrics" TEXT,
    "youtube_url" VARCHAR(500),
    "meta_title" VARCHAR(500),
    "meta_description" VARCHAR(500),
    "meta_keywords" VARCHAR(500),
    "presentation_background_color" VARCHAR(100),
    "presentation_text_color" VARCHAR(100),
    "presentation_background_image" VARCHAR(500),
    "font_size" INTEGER,
    "likes" INTEGER DEFAULT 0,
    "views" INTEGER DEFAULT 0,
    "shares" INTEGER DEFAULT 0,
    "image" VARCHAR(500),
    "lyrics_with_chords" TEXT,
    "chord_image" VARCHAR(1000),
    "lyric" JSON,
    "has_lyrics" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_favorites" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "user_id" BIGINT NOT NULL,
    "song_id" BIGINT NOT NULL,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "deleted_at" TIMESTAMP(0),
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "email_verified_at" TIMESTAMP(0),
    "password" VARCHAR(255),
    "remember_token" VARCHAR(100),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_super_admin" BOOLEAN NOT NULL DEFAULT false,
    "username" VARCHAR(50),
    "can_contribute" BOOLEAN NOT NULL DEFAULT false,
    "can_comment" BOOLEAN NOT NULL DEFAULT false,
    "can_create_playlists" BOOLEAN NOT NULL DEFAULT false,
    "can_give_likes" BOOLEAN NOT NULL DEFAULT false,
    "is_subscribed" BOOLEAN NOT NULL DEFAULT true,
    "country" VARCHAR(2) DEFAULT 'NI',
    "ignore_verification" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verses" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "song_id" BIGINT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "verse_type" INTEGER NOT NULL DEFAULT 1,
    "content" TEXT,

    CONSTRAINT "verses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."video_authors" (
    "video_id" BIGINT NOT NULL,
    "author_id" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."videos" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "song_id" BIGINT NOT NULL,
    "title" VARCHAR(255),
    "slug" VARCHAR(255),
    "uuid" UUID,
    "description" TEXT,
    "video_url" VARCHAR(255) NOT NULL,
    "thumbnail_url" VARCHAR(255),
    "meta_title" VARCHAR(500),
    "meta_description" VARCHAR(500),
    "meta_keywords" VARCHAR(500),
    "likes" INTEGER DEFAULT 0,
    "views" INTEGER DEFAULT 0,
    "shares" INTEGER DEFAULT 0,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "failed_jobs_uuid_unique" ON "public"."failed_jobs"("uuid" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "folder_song_folder_id_song_id_unique" ON "public"."folder_song"("folder_id" ASC, "song_id" ASC);

-- CreateIndex
CREATE INDEX "jobs_queue_index" ON "public"."jobs"("queue" ASC);

-- CreateIndex
CREATE INDEX "magic_link_codes_email_index" ON "public"."magic_link_codes"("email" ASC);

-- CreateIndex
CREATE INDEX "notifications_notifiable_type_notifiable_id_index" ON "public"."notifications"("notifiable_type" ASC, "notifiable_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "personal_access_tokens_token_unique" ON "public"."personal_access_tokens"("token" ASC);

-- CreateIndex
CREATE INDEX "personal_access_tokens_tokenable_type_tokenable_id_index" ON "public"."personal_access_tokens"("tokenable_type" ASC, "tokenable_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "playlists_uuid_unique" ON "public"."playlists"("uuid" ASC);

-- CreateIndex
CREATE INDEX "seo_model_type_model_id_index" ON "public"."seo"("model_type" ASC, "model_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_unique" ON "public"."users"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_unique" ON "public"."users"("username" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "videos_uuid_unique" ON "public"."videos"("uuid" ASC);

-- AddForeignKey
ALTER TABLE "public"."folder_song" ADD CONSTRAINT "folder_song_folder_id_foreign" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."folder_song" ADD CONSTRAINT "folder_song_song_id_foreign" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."playlist_song" ADD CONSTRAINT "playlist_song_playlist_id_foreign" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."playlist_song" ADD CONSTRAINT "playlist_song_song_id_foreign" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

