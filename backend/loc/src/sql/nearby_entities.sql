CREATE OR REPLACE FUNCTION nearby_entities(lat FLOAT, long FLOAT, entity_type TEXT)
RETURNS TABLE (
    id TEXT,
    name TEXT,
    email TEXT,
    age FLOAT,
    gender TEXT,
    college TEXT,
    isVisible BOOLEAN,
    lat FLOAT,
    long FLOAT,
    dist_meters FLOAT
)
LANGUAGE SQL
AS $$
    SELECT
        entity.id,
        entity.name,
        entity.email,
        entity.age,
        entity.gender,
        entity.college,
        entity."isVisible",
        latitude AS lat,
        longitude AS long,
        ST_DISTANCE(
            ST_GeomFromText('POINT(' || long || ' ' || lat || ')', 4326)::geography,
            ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
        ) AS dist_meters
    FROM
        "Location"
    JOIN
        "User" entity ON "Location".id = entity."locationId"
    WHERE
        entity_type = 'user'
    ORDER BY
        ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography <-> ST_GeomFromText('POINT(' || long || ' ' || lat || ')', 4326)::geography;
$$;



