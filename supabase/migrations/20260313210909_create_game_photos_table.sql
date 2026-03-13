CREATE TABLE public.game_photos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    user_email text NOT NULL,
    game_id integer NOT NULL,
    league text NOT NULL,
    game_date date NOT NULL,
    home_team text NOT NULL,
    away_team text NOT NULL,

    storage_path text NOT NULL,
    caption text,
    created_at timestamp DEFAULT now(),

    FOREIGN KEY (
        user_email,
        game_id,
        league,
        game_date,
        home_team,
        away_team
    )
    REFERENCES public.games (
        user_email,
        game_id,
        league,
        game_date,
        home_team,
        away_team
    )
    ON DELETE CASCADE
);