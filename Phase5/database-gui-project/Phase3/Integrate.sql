ALTER TABLE public.venue
ADD COLUMN parking character varying(256);

CREATE TABLE IF NOT EXISTS public.performer (
    performerid SERIAL PRIMARY KEY,
    performername VARCHAR(256) NOT NULL,
    perfcontactinfo VARCHAR(256) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.event_performer (
    eventid INTEGER NOT NULL,
    performerid INTEGER NOT NULL,
    PRIMARY KEY (eventid, performerid),
    FOREIGN KEY (eventid) REFERENCES public.events(eventid) ON DELETE CASCADE,
    FOREIGN KEY (performerid) REFERENCES public.performer(performerid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.sponsor (
    sponsorid SERIAL PRIMARY KEY,
    sponsorname VARCHAR(256) NOT NULL,
    payment NUMERIC(10,2)
);

CREATE TABLE IF NOT EXISTS public.event_sponsor (
    eventid INTEGER NOT NULL,
    sponsorid INTEGER NOT NULL,
    PRIMARY KEY (eventid, sponsorid),
    FOREIGN KEY (eventid) REFERENCES public.events(eventid) ON DELETE CASCADE,
    FOREIGN KEY (sponsorid) REFERENCES public.sponsor(sponsorid) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.ticket (
    ticketid SERIAL PRIMARY KEY,
    price NUMERIC(10,2) NOT NULL,
    saledate DATE NOT NULL,
    eventid INTEGER NOT NULL,
    cusid INTEGER NOT NULL,
    FOREIGN KEY (eventid) REFERENCES public.events(eventid) ON DELETE CASCADE,
    FOREIGN KEY (cusid) REFERENCES public.customers(cusid) ON DELETE CASCADE
);


-- לכל אירוע נשייך מופיע אחד (באופן מעגלי)
INSERT INTO event_performer (eventid, performerid)
SELECT e.eventid, p.performerid
FROM (
    SELECT eventid, ROW_NUMBER() OVER () as rn FROM events
) e
JOIN (
    SELECT performerid, ROW_NUMBER() OVER () as rn FROM performer
) p ON (e.rn % (SELECT COUNT(*) FROM performer) + 1) = p.rn;


-- לכל אירוע נשייך ספונסר אחד (באופן מעגלי)
INSERT INTO event_sponsor (eventid, sponsorid)
SELECT e.eventid, s.sponsorid
FROM (
    SELECT eventid, ROW_NUMBER() OVER () as rn FROM events
) e
JOIN (
    SELECT sponsorid, ROW_NUMBER() OVER () as rn FROM sponsor
) s ON (e.rn % (SELECT COUNT(*) FROM sponsor) + 1) = s.rn;
