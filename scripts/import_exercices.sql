-- Script généré automatiquement
-- Colle ce contenu dans Supabase > SQL Editor et clique Run

DO $$
DECLARE
  fid uuid;
BEGIN

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('A skip', fid, 'sprint_mechanics | coordination', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('B skip', fid, 'sprint_mechanics | coordination', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('C skip', fid, 'sprint_mechanics | coordination', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Griffé', fid, 'sprint_mechanics | stiffness', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Talons fesses', fid, 'sprint_mechanics | flexibility', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Skipping sur place', fid, 'neural_speed | stiffness', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Skipping élastique sur place', fid, 'neural_speed | stiffness', '{band}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Skipping axe résistance élastique', fid, 'resisted_acceleration | stiffness', '{band}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Build up sprint', fid, 'sprint_top_speed | acceleration', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Flying sprint', fid, 'sprint_top_speed | speed', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint en descente légère', fid, 'overspeed | speed', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint en côte', fid, 'resisted_acceleration | strength', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint résisté élastique', fid, 'resisted_acceleration | strength', '{band}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse', fid, 'sprint_top_speed | speed', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse 8 axe', fid, 'agility | speed', '{cones}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse 8 latéral', fid, 'agility | speed', '{cones}', '{cut}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse FB', fid, 'sprint_top_speed | agility', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse avant arriere', fid, 'agility | deceleration', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse avant arriere sur ligne', fid, 'agility | deceleration', '{cones}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse courbe', fid, 'sprint_top_speed | agility', '{cones}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse en descente', fid, 'overspeed | speed', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse fausse piste', fid, 'agility | reaction', '{none}', '{cut}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse freinage fort', fid, 'deceleration | strength', '{none}', '{decel}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse navette', fid, 'agility | conditioning', '{cones}', '{sprint}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse navettes répétées', fid, 'rsa | agility', '{cones}', '{sprint}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse changements de directions', fid, 'agility | deceleration', '{cones}', '{cut}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse changements de rythmes', fid, 'agility | conditioning', '{none}', '{sprint}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse départ arrêté', fid, 'start | speed', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse jump avant arriere', fid, 'agility | plyometric', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse rebond 1 pied', fid, 'stiffness | proprioception', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse saut decalage', fid, 'agility | plyometric', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse saut et réactivité au sol', fid, 'agility | reaction', '{none}', '{jump}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse SJ et jump avant', fid, 'explosive_power | speed', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse appuis 45° et accélération', fid, 'start | agility', '{cones}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse appuis avant 1 pied décalage', fid, 'agility | stiffness', '{cones}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Changement de rythme et direction - vitesse', fid, 'agility | speed', '{cones}', '{cut}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Accélération + Décélération', fid, 'deceleration | acceleration', '{cones}', '{sprint}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Biomécanique course élastique', fid, 'sprint_mechanics | posture', '{band}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Technique course - psoas - élastique', fid, 'sprint_mechanics | psoas', '{band}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('COURSE EN CÔTE', fid, 'resisted_acceleration | conditioning', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('skipping + vitesse', fid, 'neural_speed | stiffness', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('skipping + vitesse en côtes', fid, 'neural_speed | stiffness', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('skipping latéral résistance élastique', fid, 'lateral_speed | stiffness', '{band}', '{shuffle}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('skipping latéral jump retour', fid, 'lateral_speed | plyometric', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('skipping latéral 1 jambe', fid, 'stiffness | balance', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint accélération', fid, 'start | speed', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Falling start', fid, 'start | projection', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Course arrière avant blocage avec élastique', fid, 'deceleration | reaction', '{band}', '{decel}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Course arrière et blocage avant avec élastique', fid, 'deceleration | acceleration', '{band}', '{decel}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Course avant arrière avec élastique', fid, 'agility | acceleration', '{band}', '{sprint}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Course avant arrière 3/4 élastique', fid, 'agility | acceleration', '{band}', '{sprint}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Course 3/4 élastique', fid, 'resisted_acceleration | speed', '{band}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Course avant arrière + deadlift 1 jambe - élastique', fid, 'agility | strength', '{band}', '{hinge}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Course avant arrière + retournement élastique', fid, 'agility | reaction', '{band}', '{cut}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('déplacement arrière- avant résistance élastique avant', fid, 'deceleration | acceleration', '{band}', '{decel}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('déplacement avant arriere latéral + élastique', fid, 'agility | deceleration', '{band}', '{shuffle}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('déplacement crabe avant arrières', fid, 'lateral_speed | conditioning', '{none}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('déplacement latéral + vitesse', fid, 'agility | speed', '{none}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('déplacement latéral avant arrière', fid, 'agility | deceleration', '{none}', '{shuffle}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Déplacement latérale', fid, 'lateral_speed | agility', '{none}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Déplacement élastique latéral', fid, 'lateral_speed | strength', '{band}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Déplacements latéraux élastique', fid, 'lateral_speed | strength', '{band}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Broad jump - élastique', fid, 'explosive_power | strength', '{band}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('slalom avant résistance élastique', fid, 'agility | deceleration', '{band,cones}', '{cut}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('appuis carré plots', fid, 'agility | coordination', '{cones}', '{shuffle}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('appuis skipping latéral 1 plots', fid, 'lateral_speed | coordination', '{cones}', '{shuffle}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Appuis 1 pied progression droite gauche', fid, 'coordination | balance', '{none}', '{shuffle}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Appuis avant arrière axe', fid, 'coordination | speed', '{none}', '{shuffle}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Appuis avant arrière en vitesse', fid, 'agility | coordination', '{none}', '{shuffle}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Appuis jumps avant arrière 45°', fid, 'agility | plyometric', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Appuis latéraux en rebond 1 jambe', fid, 'lateral_speed | balance', '{none}', '{shuffle}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Appuis latéraux vitesse', fid, 'lateral_speed | coordination', '{none}', '{shuffle}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Appuis un pied avant arrière translation latérale', fid, 'agility | balance', '{none}', '{shuffle}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Jump avant course arrière', fid, 'agility | plyometric', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Jump avant course arrière élastique', fid, 'agility | strength', '{band}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('jump avant + résistance élastique', fid, 'resisted_acceleration | plyometric', '{band}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle 3:4 avant', fid, 'coordination | rhythm', '{ladder}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle avant arrière', fid, 'coordination | rhythm', '{ladder}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle cloche pied', fid, 'coordination | rhythm', '{ladder}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle cloche pied latéral', fid, 'coordination | rhythm', '{ladder}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle croisés latéraux', fid, 'coordination | agility', '{ladder}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle déplacement de 3:4', fid, 'coordination | rhythm', '{ladder}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle fermeture ouverture', fid, 'coordination | footwork', '{ladder}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle griffé', fid, 'stiffness | rhythm', '{ladder}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle mobilité adducteurs', fid, 'coordination | mobility', '{ladder}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle mobilité externe + appuis ext', fid, 'coordination | mobility', '{ladder}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle moblilité externe', fid, 'coordination | mobility', '{ladder}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle skipping', fid, 'coordination | stiffness', '{ladder}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle skipping 1 jambe', fid, 'coordination | stiffness', '{ladder}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle skipping latérale', fid, 'lateral_speed | coordination', '{ladder}', '{shuffle}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle Fentes sautées', fid, 'coordination | plyometric', '{ladder}', '{lunge}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle Pompes sautées', fid, 'coordination | upper_body', '{ladder}', '{push}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle Skipping coordination bras', fid, 'coordination | arm_sync', '{ladder}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echelle un pied rapide', fid, 'stiffness | speed', '{ladder}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('séance coordination proprioception', fid, 'proprioception | coordination', '{none}', '{shuffle}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Drop jump', fid, 'reactive_strength | stiffness', '{bench}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Drop Jump + détentes', fid, 'reactive_strength | plyometric', '{bench}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Drop Jump 1 pied stabilisation', fid, 'reactive_strength | balance', '{bench}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Drop jump 1 pied + rebonds', fid, 'reactive_strength | stiffness', '{bench}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Détentes 1 jambe', fid, 'explosive_power | balance', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Détentes alternées', fid, 'explosive_power | coordination', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Détentes alternées sur box', fid, 'explosive_power | coordination', '{bench}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Détente sur banc', fid, 'explosive_power | strength', '{bench}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Détentes sur banc réception 1 pied', fid, 'explosive_power | balance', '{bench}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Détentes sur box plio', fid, 'explosive_power | strength', '{bench}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Détentes avec élastique', fid, 'explosive_power | strength', '{band}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('détentes changements de pieds', fid, 'explosive_power | coordination', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Double détente banc', fid, 'reactive_strength | plyometric', '{bench}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Foulées bondissantes', fid, 'explosive_power | speed', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Foulées Bondissantes + vitesse', fid, 'explosive_power | speed', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Jump avant arrière stabilité 1 pied', fid, 'landing_stability | balance', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Jump latéraux + stabilisation 1 pied', fid, 'landing_stability | balance', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pliométrie Squat chargé et sauts déchargés', fid, 'contrast_power | strength', '{band}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pliométrie latérale', fid, 'explosive_power | agility', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pliométrie rebond 1 pied et saut genoux', fid, 'reactive_strength | plyometric', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pliométrie sauts genoux', fid, 'explosive_power | plyometric', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pliométrie sauts rapides D-G', fid, 'explosive_power | coordination', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pliométrie Rebonds 1 pied', fid, 'stiffness | balance', '{none}', '{jump}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SQUAT JUMP', fid, 'explosive_power | strength', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SQUAT JUMP + FORWARD LUNGE', fid, 'explosive_power | strength', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SQUAT JUMP + ROTATION BASSIN', fid, 'explosive_power | mobility', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SQUAT JUMP + STABILISER 1 JAMBE', fid, 'explosive_power | balance', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SQUAT JUMP 1/4 TURN', fid, 'explosive_power | agility', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat Jump + appuis latéral', fid, 'explosive_power | agility', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('squats jumps demi tour', fid, 'explosive_power | agility', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sauts cerceaux - élastique', fid, 'explosive_power | agility', '{band,cones}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sauts cerceaux avant élastique', fid, 'explosive_power | agility', '{band,cones}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sauts plio faible', fid, 'explosive_power | coordination', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Side jump plus 2eme détente', fid, 'reactive_power | agility', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Side jumps', fid, 'explosive_power | agility', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sumo squat jump', fid, 'explosive_power | strength', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sumo squat kettlebell plus plio détentes', fid, 'contrast_power | strength', '{kettlebell}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('demi fentes jumps', fid, 'explosive_power | strength', '{none}', '{lunge}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('fentes stationnaires jumps', fid, 'explosive_power | strength', '{none}', '{lunge}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('jump lunge charge-sans charge', fid, 'contrast_power | strength', '{band}', '{lunge}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lunge jump répétées', fid, 'explosive_power | strength', '{none}', '{lunge}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Corde à sauter', fid, 'stiffness | conditioning', '{rope}', '{jump}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mollets plio', fid, 'stiffness | strength', '{none}', '{jump}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('1/4 Squats + plio', fid, 'contrast_power | strength', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Demi squat', fid, 'lower_body_strength | posture', '{none}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat Tyson', fid, 'lower_body_strength | mobility', '{none}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat dynamique élastique', fid, 'lower_body_strength | strength', '{band}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squats dynamiques élastique + plio', fid, 'contrast_power | strength', '{band}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat RLD élastique', fid, 'lower_body_strength | balance', '{band}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat course externe', fid, 'lower_body_strength | hip_mobility', '{none}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat écart jump', fid, 'explosive_power | strength', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat dynamique élastique + plio', fid, 'contrast_power | strength', '{band}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('FORWARD LUNGE', fid, 'lower_body_strength | balance', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('REVERSE LUNGE', fid, 'lower_body_strength | balance', '{none}', '{lunge}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('REVERSE LUNGE + COUP DE GENOUX', fid, 'lower_body_strength | coordination', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('REVERSE LUNGE + PECTORAUX', fid, 'lower_body_strength | upper_body', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SIDE LUNGE + KICK', fid, 'lower_body_strength | mobility', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SIDE LUNGE + REVERSE LUNGE', fid, 'lower_body_strength | mobility', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SIDE TO SIDE LUNGE', fid, 'lower_body_strength | mobility', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SIDE TO SIDE LUNGE + JUMP + PUNCH', fid, 'explosive_power | upper_body', '{none}', '{lunge}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('LUNGE + LEVER DE GENOUX', fid, 'lower_body_strength | coordination', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('LUNGE + ROTATION TORSE', fid, 'lower_body_strength | mobility', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('LUNGE EN CONTREBAS', fid, 'lower_body_strength | range_of_motion', '{bench}', '{lunge}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente avant - arrière', fid, 'lower_body_strength | coordination', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente avant et retour équilibre', fid, 'lower_body_strength | balance', '{none}', '{lunge}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente avant + développé 1 bras et rotations', fid, 'lower_body_strength | upper_body', '{dumbbell}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente arrière + saut', fid, 'explosive_power | strength', '{none}', '{lunge}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente dynamique élastique', fid, 'lower_body_strength | agility', '{band}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente jambe arrière tendue', fid, 'lower_body_strength | flexibility', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente latérale élastIque A', fid, 'adductors | agility', '{band}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente latérale + équilibre', fid, 'lower_body_strength | balance', '{none}', '{lunge}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente latérale + stabilité', fid, 'lower_body_strength | balance', '{none}', '{lunge}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente stationnaire Poids', fid, 'lower_body_strength | strength', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes arrières TRX', fid, 'lower_body_strength | balance', '{trx}', '{lunge}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes avant droite-gauche élastique', fid, 'lower_body_strength | agility', '{band}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes excentriques', fid, 'lower_body_strength | hamstrings', '{none}', '{lunge}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes excentriques + accélération', fid, 'lower_body_strength | speed', '{none}', '{lunge}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes jambe arrière tendu + jump', fid, 'explosive_power | flexibility', '{none}', '{lunge}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes latérales', fid, 'adductors | mobility', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes marchées', fid, 'lower_body_strength | coordination', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes marchées haltères', fid, 'lower_body_strength | strength', '{dumbbell}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes marchées sautées', fid, 'explosive_power | coordination', '{none}', '{lunge}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes plio + vitesse', fid, 'explosive_power | speed', '{none}', '{lunge}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('fentes à 45°', fid, 'lower_body_strength | agility', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('fentes Curtsy', fid, 'adductors | glutes', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Double fentes montée sur banc', fid, 'lower_body_strength | coordination', '{bench}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes décalages latéraux', fid, 'adductors | agility', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes pointe de pied', fid, 'calves | balance', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes poussées latérales genou haut', fid, 'lower_body_strength | agility', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes sautées TRX', fid, 'explosive_power | balance', '{trx}', '{lunge}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('fente sur pointe avec élastique', fid, 'calves | balance', '{band}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lunges avant arrières', fid, 'lower_body_strength | coordination', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente arrière plus déstabilisation élastique int genoux', fid, 'knee_prehab | balance', '{band}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente arrière + détente - élastique', fid, 'explosive_power | strength', '{band}', '{lunge}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente stationnaire + élastique', fid, 'lower_body_strength | stability', '{band}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes latérales contre élastique', fid, 'adductors | stability', '{band}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes arrières + Push élastique', fid, 'lower_body_strength | upper_body', '{band}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes dynamiques élastique + plio', fid, 'contrast_power | strength', '{band}', '{lunge}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes une jambe arrière tendue + élastique', fid, 'hamstrings | balance', '{band}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('HIP THRUST', fid, 'lower_body_strength | glutes', '{none}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('HIP THRUST SUR BANC', fid, 'lower_body_strength | glutes', '{bench}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('HIP THRUST SUR BANC 1 JAMBE', fid, 'lower_body_strength | balance', '{bench}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('HIP THRUST (machine)', fid, 'lower_body_strength | glutes', '{machine}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hip thrust dynamique 1 jambe', fid, 'lower_body_strength | coordination', '{bench}', '{hinge}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('GLUTE BRIDGE MARCH', fid, 'lower_body_strength | coordination', '{none}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('BRIDGE DOS', fid, 'lower_body_strength | posture', '{none}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('BRIDGE DOS 1 JAMBE EN ALTERNANCE', fid, 'lower_body_strength | balance', '{none}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SINGLE LEG BRIDGE DYNAMIQUE', fid, 'lower_body_strength | balance', '{none}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SINGLE LEG GLUTE BRIDGE HOLD', fid, 'lower_body_strength | balance', '{none}', '{hinge}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('DEADLIFT ONE LEG', fid, 'lower_body_strength | balance', '{none}', '{hinge}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('RLD une jambe haltères', fid, 'lower_body_strength | balance', '{dumbbell}', '{hinge}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('RLD plus développé épaules haltères', fid, 'lower_body_strength | upper_body', '{dumbbell}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Kettlebell swing', fid, 'explosive_power | strength', '{kettlebell}', '{hinge}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Kettlebell swing 1 bras', fid, 'explosive_power | coordination', '{kettlebell}', '{hinge}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Montées sur banc', fid, 'lower_body_strength | balance', '{bench}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Montées sur banc + détente', fid, 'explosive_power | balance', '{bench}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Montées sur banc latérales', fid, 'lower_body_strength | agility', '{bench}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mollets 1 pied', fid, 'lower_body_strength | balance', '{step}', '{jump}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mollets 2 pieds', fid, 'lower_body_strength | strength', '{step}', '{jump}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Montées sur pointe de pied (mollet)', fid, 'lower_body_strength | balance', '{step}', '{jump}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Flexion genoux axe élastique', fid, 'knee_prehab | strength', '{band}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Flexions 1 jambe course externe', fid, 'lower_body_strength | balance', '{none}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Equilibre renfo postérieur + haltère', fid, 'lower_body_strength | balance', '{dumbbell}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Chaise isométrique', fid, 'lower_body_strength | endurance', '{wall}', '{squat}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Chaise iso + plio + percutions', fid, 'lower_body_strength | conditioning', '{wall}', '{squat}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Chaise iso + saut avant+arriere+sprint', fid, 'lower_body_strength | speed', '{wall}', '{sprint}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Chaise isométrique + jump + skipping', fid, 'lower_body_strength | conditioning', '{wall}', '{jump}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat et dév épaules élastique accroché', fid, 'lower_body_strength | upper_body', '{band}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat épaule élastique', fid, 'lower_body_strength | upper_body', '{band}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Détente sur banc réception 1 pied', fid, 'explosive_power | balance', '{bench}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Nordic hamstrings', fid, 'hamstring_prehab | strength', '{none}', '{hinge}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Nordic avec élastique', fid, 'hamstring_prehab | strength', '{band}', '{hinge}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ISCHIOS CONCENTRIQUE SUR BANC 1 JAMBE', fid, 'lower_body_strength | balance', '{bench}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ischios concentriques', fid, 'lower_body_strength | strength', '{none}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ischios curls TRX', fid, 'lower_body_strength | balance', '{trx}', '{hinge}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ischios leg curl alternés TRX', fid, 'lower_body_strength | coordination', '{trx}', '{hinge}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ischios deadlift 1 jambe élastique', fid, 'lower_body_strength | balance', '{band}', '{hinge}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ischios polyarticulaires élastique', fid, 'lower_body_strength | strength', '{band}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ischios rapides élastique', fid, 'lower_body_strength | speed', '{band}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ischios Mini bande', fid, 'lower_body_strength | strength', '{band}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ischios balancement arrière mini bande', fid, 'lower_body_strength | coordination', '{band}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('renforcement ischios élastique', fid, 'lower_body_strength | strength', '{band}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Adducteurs élastique', fid, 'adductors | strength', '{band}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('adducteurs rapides élastiques', fid, 'adductors | speed', '{band}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Genoux flexions + élastique à l''intérieur', fid, 'knee_prehab | balance', '{band}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Genoux stabilité flexion élastique côté', fid, 'knee_prehab | balance', '{band}', '{squat}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Genou flexion extension avec détente et élastique intérieur du genou', fid, 'knee_prehab | balance', '{band}', '{squat}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Psoas 1 jambe mini bande', fid, 'lower_body_strength | balance', '{band}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Psoas mini bande', fid, 'lower_body_strength | strength', '{band}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Psoas levées genoux élastique', fid, 'lower_body_strength | speed', '{band}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('psoas élastique rapide', fid, 'lower_body_strength | speed', '{band}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente latérale + kick adducteurs élastique', fid, 'adductors | agility', '{band}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente latérale + kick interieur', fid, 'adductors | agility', '{none}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente latérale stabilité montés genoux haltère', fid, 'adductors | upper_body', '{dumbbell}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente latérale retour équilibre élastique', fid, 'adductors | balance', '{band}', '{lunge}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hanche élastique', fid, 'hip_prehab | strength', '{band}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hanches déplacement 3/4 mini bande au genou', fid, 'hip_prehab | coordination', '{band}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hanches déplacements latéraux mini bande', fid, 'hip_prehab | strength', '{band}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hanches rapidité mini bande', fid, 'hip_prehab | speed', '{band}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hanches rotations mini bandes', fid, 'hip_prehab | mobility', '{band}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Quadriceps élastique', fid, 'lower_body_strength | knee_rehab', '{band}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ROTATION HANCHES EXTERNE', fid, 'hip_prehab | mobility', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ROTATION HANCHES INTERNE', fid, 'hip_prehab | mobility', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Cheville Axe', fid, 'ankle_prehab | mobility', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Cheville Renfo Latéral', fid, 'ankle_prehab | strength', '{band}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Cheville Rotations sans appuis', fid, 'ankle_prehab | mobility', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Cheville rotations externes', fid, 'ankle_prehab | mobility', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Cheville rotations internes', fid, 'ankle_prehab | mobility', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS AB Bicycle', fid, 'core_stability | rotation', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS COMMANDO', fid, 'core_stability | upper_body', '{none}', '{push}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS FLOOR WHIPPERS', fid, 'core_stability | mobility', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS HEEL TAPS', fid, 'core_stability | coordination', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS HOLLOW BODY HOLD', fid, 'core_stability | posture', '{none}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Jack knife oblique', fid, 'core_stability | rotation', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS OBLIQUE ROLL DOWN', fid, 'core_stability | rotation', '{none}', '{rotation}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS PLANCHE + FLEXIONS CROISÉES HANCHES', fid, 'core_stability | hip_mobility', '{none}', '{carry}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Planche latérale coude genou', fid, 'core_stability | obliques', '{none}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Planche latérale 1 jambe sur ballon', fid, 'core_stability | balance', '{ball}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Planche latérale 1 jambe sur coude', fid, 'core_stability | obliques', '{none}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Planche latérale 2 jambe sur ballon', fid, 'core_stability | balance', '{ball}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Planche latérale statique 1 jambe adducteur sur ballon', fid, 'core_stability | adductors', '{ball}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Planche latérale sur genou', fid, 'core_stability | obliques', '{none}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS RAMEUR AXE', fid, 'core_stability | posture', '{none}', '{crawl}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS RAMEUR OBLIQUES BAS', fid, 'core_stability | rotation', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS RAMEUR OBLIQUES HAUT', fid, 'core_stability | rotation', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Rameur alterné 2', fid, 'core_stability | coordination', '{none}', '{crawl}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS STAR CRUNCH', fid, 'core_stability | coordination', '{none}', '{crawl}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS X Plank', fid, 'core_stability | coordination', '{none}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Abs planche + rotation interne', fid, 'core_stability | obliques', '{none}', '{rotation}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Abs planche latérale 1 jambe sur main', fid, 'core_stability | balance', '{none}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Russian twist avec ballon', fid, 'core_stability | rotation', '{ball}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Russian twist + rebond ballon', fid, 'core_stability | rotation', '{ball}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Relevè de genoux', fid, 'core_stability | hip_flexor', '{none}', '{crawl}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Relevé de buste bras tendus avec ballon', fid, 'core_stability | hip_flexor', '{ball}', '{crawl}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Relevés de genoux position pompes sur ballon', fid, 'core_stability | hip_flexor', '{ball}', '{crawl}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS 8 rameur avec ballon', fid, 'core_stability | rotation', '{ball}', '{crawl}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Abs Jacknife TRX', fid, 'core_stability | hip_flexor', '{trx}', '{crawl}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('abs Pike TRX sur les mains', fid, 'core_stability | upper_body', '{trx}', '{crawl}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Abs rameur élastique +tirage dos', fid, 'core_stability | upper_body', '{band}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Obliques ballon entre les genoux', fid, 'core_stability | adductors', '{ball}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Rameur axe ballon entre genoux', fid, 'core_stability | adductors', '{ball}', '{crawl}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Rameur axe ballon entre les pieds', fid, 'core_stability | hip_flexor', '{ball}', '{crawl}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Rameur obliques ballon entre les pieds', fid, 'core_stability | rotation', '{ball}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS relevé de buste axe ballon entre les genoux', fid, 'core_stability | adductors', '{ball}', '{crawl}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS statique ballon entre les pieds', fid, 'core_stability | hip_flexor', '{ball}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS toucher ballon jambe tendue', fid, 'core_stability | hamstrings', '{ball}', '{crawl}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS échange ballon pied-main', fid, 'core_stability | coordination', '{ball}', '{crawl}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Abs synchro haut et bas ballon pied', fid, 'core_stability | coordination', '{ball}', '{crawl}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SIT UP AVEC EXTENSION DES BRAS', fid, 'core_stability | posture', '{none}', '{crawl}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('OBLIQUES PIEDS AU SOL', fid, 'core_stability | rotation', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Séance abdominaux', fid, 'core_stability | conditioning', '{none}', '{crawl}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SHOULDER TAP', fid, 'core_stability | balance', '{none}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SHOULDER TAP + OPEN CLOSE LEG', fid, 'core_stability | balance', '{none}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dead bug inversé', fid, 'core_stability | lumbar', '{none}', '{crawl}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dead bug inversé + genou', fid, 'core_stability | hip_flexor', '{none}', '{crawl}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('gainage lombaire', fid, 'core_stability | posture', '{none}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('gainage lombaire une jambe en alternance', fid, 'core_stability | balance', '{none}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Gainage lombaire une jambe en alternance', fid, 'core_stability | balance', '{none}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Moutain climber + pompes sur ballon', fid, 'upper_body_strength | core', '{ball}', '{push}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Rotations 1 élastique', fid, 'core_stability | rotation', '{band}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Rotations bas du corps', fid, 'core_stability | hip_mobility', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Rotations torse 2 élastique', fid, 'core_stability | rotation', '{band}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lombaires 2 appuis avec ballon', fid, 'lumbar_strength | posture', '{ball}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lombaires 2 jambes sur ballon', fid, 'lumbar_strength | glutes', '{ball}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lombaires alternance 1 jambe - position pompe sur ballon', fid, 'lumbar_strength | balance', '{ball}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lombaires floor T raise', fid, 'lumbar_strength | scapular', '{none}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lombaires floor Y raise', fid, 'lumbar_strength | scapular', '{none}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lombaires ischios 1 jambe équilibre sur ballon', fid, 'lumbar_strength | hamstrings', '{ball}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lombaires ischios 2 jambes équilibre sur ballon', fid, 'lumbar_strength | hamstrings', '{ball}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lombaires planche 3 appuis avec ballon', fid, 'lumbar_strength | balance', '{ball}', '{carry}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lombaires sur ballon avec changements de jambe', fid, 'lumbar_strength | coordination', '{ball}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lombaires sur ballon une jambe', fid, 'lumbar_strength | balance', '{ball}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('lombaires pulse rows', fid, 'lumbar_strength | upper_body', '{none}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('lombaires superman towel row', fid, 'lumbar_strength | upper_body', '{none}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('JUMP PROPRIOCEPTION', fid, 'proprioception | plyometric', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Proprioception + vitesse', fid, 'proprioception | speed', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Proprioception droite gauche rapidité intérieur', fid, 'proprioception | coordination', '{none}', '{shuffle}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Proprioception droite gauche rapidité extérieur', fid, 'proprioception | coordination', '{none}', '{shuffle}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Proprioception horloge', fid, 'proprioception | balance', '{none}', '{shuffle}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Proprioception rotation externe', fid, 'proprioception | hip_stability', '{none}', '{rotation}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Proprioception saut 1 jambe et stabilisation', fid, 'proprioception | plyometric', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Proprioception sauts avant arrière', fid, 'proprioception | plyometric', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Proprioception sauts latéraux', fid, 'proprioception | agility', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Proprioception tour', fid, 'proprioception | agility', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('proprioception rotations extérieur-intérieur', fid, 'proprioception | hip_stability', '{none}', '{rotation}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('MOBILITÉ ISCHIOS ET ABDUCTEURS', fid, 'mobility | flexibility', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('MOBILITÉ ISCHIOS ET ADDUCTEURS', fid, 'mobility | flexibility', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité adducteurs', fid, 'mobility | flexibility', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('mobilité latérale adducteurs', fid, 'mobility | flexibility', '{none}', '{lunge}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité avant arrière', fid, 'mobility | flexibility', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité élévations latérales', fid, 'mobility | flexibility', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité griffé ischios', fid, 'mobility | flexibility', '{none}', '{sprint}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité ischios avant', fid, 'mobility | flexibility', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité ischios arrière', fid, 'mobility | flexibility', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité rotations externes hanches', fid, 'mobility | hip_stability', '{none}', '{rotation}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité Rotations haut du corps', fid, 'mobility | flexibility', '{none}', '{rotation}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité hanches au sol', fid, 'mobility | flexibility', '{none}', '{rotation}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité rotations bassin', fid, 'mobility | flexibility', '{none}', '{rotation}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Epaules mobilité élastique', fid, 'mobility | flexibility', '{band}', '{rotation}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('down ward dog ischios', fid, 'mobility | flexibility', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stretch Adducteurs au sol', fid, 'mobility | flexibility', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stretch Adducteurs 2 au sol', fid, 'mobility | flexibility', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stretch Fessiers', fid, 'mobility | flexibility', '{none}', '{rotation}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stretch fessiers', fid, 'mobility | flexibility', '{none}', '{rotation}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stretch Hanches au sol', fid, 'mobility | flexibility', '{none}', '{rotation}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stretch Hanches debout', fid, 'mobility | flexibility', '{none}', '{rotation}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stretch Ischios (arrière cuisse)', fid, 'mobility | flexibility', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stretch Ischios au sol', fid, 'mobility | flexibility', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stretch Lombaires', fid, 'mobility | flexibility', '{none}', '{rotation}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stretch Mollets', fid, 'mobility | flexibility', '{wall}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stretch Psoas', fid, 'mobility | flexibility', '{none}', '{lunge}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stretch Quadriceps', fid, 'mobility | flexibility', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stretch côté', fid, 'mobility | flexibility', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fartlek', fid, 'aerobic | speed', '{none}', '{sprint}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Intermittent', fid, 'aerobic | speed', '{none}', '{sprint}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('PMA', fid, 'aerobic | speed', '{none}', '{sprint}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('PMA NAVETTE', fid, 'aerobic | agility', '{cones}', '{sprint}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Course', fid, 'aerobic | endurance', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ski erg', fid, 'conditioning | upper_body', '{machine}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('BATTLE ROPE', fid, 'conditioning | upper_body', '{rope}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Stretch' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Récupération bain froid', fid, 'recovery | recovery', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('(HIIT) PERCUTIONS+SIDE JUMP+PERCUTIONS+SAUTS GROUPÉS', fid, 'conditioning | plyometric', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('HIIT BURPEES', fid, 'conditioning | strength', '{none}', '{push}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('HIIT BURPEES + SAUTS GENOUX', fid, 'conditioning | plyometric', '{none}', '{jump}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('HIIT DEMI BURPEE', fid, 'conditioning | strength', '{none}', '{push}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('HIIT SQUAT + COURSE ARRIERE', fid, 'conditioning | speed', '{none}', '{sprint}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('HIIT) DEMI BURPEES + SQUAT', fid, 'conditioning | strength', '{none}', '{push}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('HIIT) LEVER DE GENOUX + TALONS FESSES', fid, 'conditioning | speed', '{none}', '{sprint}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('HIIT) PERCUTIONS ECARTES-SERRES + COURSE NAVETTE', fid, 'conditioning | agility', '{none}', '{shuffle}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('HIIT) TALONS FESSES + COURSE AVT-ARR', fid, 'conditioning | speed', '{none}', '{sprint}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('percutions écartées', fid, 'conditioning | coordination', '{none}', '{shuffle}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('percutions serrées', fid, 'conditioning | stiffness', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('BREAKTHROUGH', fid, 'conditioning | plyometric', '{none}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('DIAMOND PUSH UP', fid, 'upper_body_strength | triceps', '{none}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ELEVATED PIKE PUSH UP', fid, 'upper_body_strength | shoulders', '{bench}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ELEVATED PUSH UP + MOUNTAIN CLIMBER', fid, 'upper_body_strength | core', '{bench}', '{push}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('POMPES SUR 1 JAMBE ALTERNÉE', fid, 'upper_body_strength | balance', '{none}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('PUSH UP + DEMI BURPEE', fid, 'upper_body_strength | conditioning', '{none}', '{push}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('PUSH UP + ROWING', fid, 'upper_body_strength | upper_body_pull', '{dumbbell}', '{push}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('PUSH UP INCHWORM DEMI BURPEE', fid, 'upper_body_strength | mobility', '{none}', '{push}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('PUSH UP SUR UNE JAMBE', fid, 'upper_body_strength | balance', '{none}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('PUSH UP TO SIDE PLANK', fid, 'upper_body_strength | core', '{none}', '{push}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pectoraux Pompes sur ballon', fid, 'upper_body_strength | balance', '{ball}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pectoraux SCAPULAR PUSH UP', fid, 'scapular_control | posture', '{none}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pectoraux bas 1 bras élastique', fid, 'upper_body_strength | chest', '{band}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pectoraux développé 1 bras alternance élastique', fid, 'upper_body_strength | chest', '{band}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pectoraux fly un bras élastique', fid, 'upper_body_strength | chest', '{band}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pectoraux pompes changement de main avec ballon', fid, 'upper_body_strength | chest', '{ball}', '{push}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pectoraux pompes plio', fid, 'upper_body_strength | power', '{none}', '{push}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pectoraux press TRX', fid, 'upper_body_strength | chest', '{trx}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pectoraux press élastiques', fid, 'upper_body_strength | chest', '{band}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pompes élastique', fid, 'upper_body_strength | chest', '{band}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pompes changements de main', fid, 'upper_body_strength | coordination', '{none}', '{push}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('TRICEPS STOP PUSH UP', fid, 'upper_body_strength | chest', '{none}', '{push}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('TRICEPS SUR BANC', fid, 'upper_body_strength | triceps', '{bench}', '{push}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('INCHWORM TO PIKE PUSH UP', fid, 'upper_body_strength | mobility', '{none}', '{push}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dos fixateurs omoplates TRX', fid, 'upper_body_strength | posture', '{trx}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dos fixateurs omoplates élastique', fid, 'upper_body_strength | posture', '{band}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dos fixateurs ompoplates travail en V élastique', fid, 'upper_body_strength | posture', '{band}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dos fly élastique', fid, 'upper_body_strength | posture', '{band}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dos fly inversé haltères', fid, 'upper_body_strength | posture', '{dumbbell}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dos fly inversé bras tendu haltères', fid, 'upper_body_strength | posture', '{dumbbell}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dos fly inversé élastique', fid, 'upper_body_strength | posture', '{band}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dos fly inversé haltères en prise marteau', fid, 'upper_body_strength | posture', '{dumbbell}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dos fly inversé prise marteau élastique', fid, 'upper_body_strength | posture', '{band}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dos ouverture TRX', fid, 'upper_body_strength | chest', '{trx}', '{pull}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dos tirage 1 bras en fente élastique', fid, 'upper_body_strength | lower_body', '{band}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dos tirage 1 bras en fente kettlebell', fid, 'upper_body_strength | lower_body', '{kettlebell}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dos tirage Kettlbell en fentes', fid, 'upper_body_strength | lower_body', '{kettlebell}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dos tirage bras écart TRX', fid, 'upper_body_strength | posture', '{trx}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dos tirage bras serrés TRX', fid, 'upper_body_strength | posture', '{trx}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dos tirage en rotations élastique', fid, 'upper_body_strength | rotation', '{band}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Tirage dos 1 bras + switch jambes élastique', fid, 'upper_body_strength | lower_body', '{band}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Tirage dos en fentes', fid, 'upper_body_strength | lower_body', '{none}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Trapèze rowing kettlebell', fid, 'upper_body_strength | posture', '{kettlebell}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Trapèzes Rowing haltères', fid, 'upper_body_strength | posture', '{dumbbell}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Trapèzes rowing élastique', fid, 'upper_body_strength | posture', '{band}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Trapèzes rowing élastique 2', fid, 'upper_body_strength | posture', '{band}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Abs rameur élastique +tirage dos', fid, 'upper_body_strength | core', '{band}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Epaules et fixateurs omoplates TRX', fid, 'upper_body_strength | posture', '{trx}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Développé épaules un bras prise marteau haltère', fid, 'upper_body_strength | shoulder', '{dumbbell}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Epaules développé 1 bras en fentes - haltères', fid, 'upper_body_strength | lower_body', '{dumbbell}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Epaules développé 1 bras élastique', fid, 'upper_body_strength | shoulder', '{band}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Epaules développé avec rotations haltères', fid, 'upper_body_strength | shoulder', '{dumbbell}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Epaules développé élastique', fid, 'upper_body_strength | shoulder', '{band}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Epaules développé haltères', fid, 'upper_body_strength | shoulder', '{dumbbell}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Epaules développé prise neutre haltères', fid, 'upper_body_strength | shoulder', '{dumbbell}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Epaules développé supination haltères', fid, 'upper_body_strength | shoulder', '{dumbbell}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Epaules élévations Kettlebell', fid, 'upper_body_strength | shoulder', '{kettlebell}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Epaules élévations frontales et latérales Haltères', fid, 'upper_body_strength | shoulder', '{dumbbell}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Epaules élévations frontales élastique', fid, 'upper_body_strength | shoulder', '{band}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Epaules élévations frontales haltères', fid, 'upper_body_strength | shoulder', '{dumbbell}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Epaules élévations latérales haltères', fid, 'upper_body_strength | shoulder', '{dumbbell}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Epaules rotations élastique', fid, 'upper_body_strength | shoulder', '{band}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('séance renfo épaules', fid, 'upper_body_strength | shoulder', '{band,dumbbell}', '{push}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('épaule rotation externe haute élastique', fid, 'upper_body_strength | shoulder_stability', '{band}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('épaule rotations externes basse élastique', fid, 'upper_body_strength | shoulder_stability', '{band}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('épaule rotations interne basse élastique', fid, 'upper_body_strength | shoulder_stability', '{band}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SIDE DELT ROLLS', fid, 'upper_body_strength | shoulder', '{dumbbell}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente avant développé épaules TRX', fid, 'upper_body_strength | lower_body', '{trx}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente avant plus développé épaules élastique', fid, 'upper_body_strength | lower_body', '{band}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente avant plus développé épaules haltères', fid, 'upper_body_strength | lower_body', '{dumbbell}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes avant + développé haltère', fid, 'upper_body_strength | lower_body', '{dumbbell}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('TRX Fentes sautées + développé épaules', fid, 'upper_body_strength | lower_body', '{trx}', '{lunge}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat + DEV EPAULES', fid, 'upper_body_strength | lower_body', '{none}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Biceps 1 bras élastique', fid, 'upper_body_strength | biceps', '{band}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Biceps Zotman haltères', fid, 'upper_body_strength | forearm', '{dumbbell}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Biceps Zotman inversé haltères', fid, 'upper_body_strength | forearm', '{dumbbell}', '{pull}', '{mixed}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Biceps alternés prise marteau haltère', fid, 'upper_body_strength | forearm', '{dumbbell}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Biceps curl 1 bras accroupi haltères', fid, 'upper_body_strength | biceps', '{dumbbell}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Biceps curl 1 bras debout haltère', fid, 'upper_body_strength | biceps', '{dumbbell}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Biceps curl alternés haltères', fid, 'upper_body_strength | biceps', '{dumbbell}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Biceps curl avec blocage', fid, 'upper_body_strength | biceps', '{dumbbell}', '{pull}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Biceps curl haltères', fid, 'upper_body_strength | biceps', '{dumbbell}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Biceps curl prise marteau élastique', fid, 'upper_body_strength | forearm', '{band}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Biceps curls en squat élastique', fid, 'upper_body_strength | lower_body', '{band}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Biceps en squat haltères', fid, 'upper_body_strength | lower_body', '{dumbbell}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Biceps élastique', fid, 'upper_body_strength | biceps', '{band}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Triceps 1 bras prise marteau haltères', fid, 'upper_body_strength | triceps', '{dumbbell}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Triceps 2 bras derrière la tête élastique', fid, 'upper_body_strength | triceps', '{band}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Triceps 2 bras haltères', fid, 'upper_body_strength | triceps', '{dumbbell}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Triceps Kickback 1 bras haltère', fid, 'upper_body_strength | triceps', '{dumbbell}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Triceps derrière la tête élastique', fid, 'upper_body_strength | triceps', '{band}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Triceps extensions 2 bras Haltères', fid, 'upper_body_strength | triceps', '{dumbbell}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Triceps extensions arrières haltères', fid, 'upper_body_strength | triceps', '{dumbbell}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Triceps élastique', fid, 'upper_body_strength | triceps', '{band}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Triceps prise marteau 2 bras haltères', fid, 'upper_body_strength | triceps', '{dumbbell}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Triceps pronation elastique', fid, 'upper_body_strength | forearm', '{band}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Triceps un bras derrière la tête haltère', fid, 'upper_body_strength | triceps', '{dumbbell}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Halo', fid, 'upper_body_strength | shoulder', '{kettlebell}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Apprentissage Jonglage', fid, 'technique | coordination', '{ball}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Jonglage 2 pieds', fid, 'technique | coordination', '{ball}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dribbles', fid, 'technique | agility', '{ball,cones}', '{ball_skill}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Passes courtes', fid, 'technique | coordination', '{ball}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Passes longues', fid, 'technique | coordination', '{ball}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Frappe de balle', fid, 'technique | power', '{ball}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Frappe élastique', fid, 'technique | power', '{ball,band}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Frappes mini bande', fid, 'technique | power', '{ball,band}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('TIR', fid, 'technique | power', '{ball}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('TAP EXTÉRIEUR PIED', fid, 'technique | coordination', '{ball}', '{ball_skill}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('TAP INTÉRIEUR PIED', fid, 'technique | coordination', '{ball}', '{ball_skill}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Tape extérieur de pied', fid, 'technique | coordination', '{ball}', '{ball_skill}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Tape intérieur de pied', fid, 'technique | coordination', '{ball}', '{ball_skill}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Echauffement', fid, 'activation | mobility', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Échauffement 1', fid, 'activation | mobility', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Course (échauffement)', fid, 'aerobic | activation', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('A-skip bilatéral', fid, 'speed_max | technique_course; avant_seance', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('B-skip bilatéral', fid, 'speed_max | technique_course', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('C-skip (genou ouvert)', fid, 'speed_max | technique_course', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('High knees progressifs', fid, 'speed_max | technique_course', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Butt kicks progressifs', fid, 'speed_max | technique_course', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ankle stiffness drill', fid, 'speed_max | stiffness; coordination', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pose running drill', fid, 'speed_max | technique_course; biomécanique', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Drill bras course', fid, 'speed_max | technique_course; coordination', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ankling drill', fid, 'speed_max | stiffness; technique_course', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Wall drill posture sprint statique', fid, 'speed_max | technique_course; posture', '{Mur}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Wall drill dynamique montée genou', fid, 'speed_max | technique_course', '{Mur}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Falling start (chute avant → sprint)', fid, 'speed_max | technique_course; accélération', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Drill fréquence rapid fire', fid, 'coordination | fréquence_appuis; coordination', '{Échelle}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Marche athlétique haute fréquence', fid, 'coordination | fréquence_appuis', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Tempo Run', fid, 'conditioning | tempo; aérobie; mécanique', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Step Over Run', fid, 'speed_max | vmax; step_over; mécanique', '{Mini haies}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Thigh Pop Run', fid, 'speed_max | vmax; thigh_pop; drive', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Straight Leg Shuffle', fid, 'speed_max | vmax; jambe_tendue', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Arm Pump Drill', fid, 'speed_max | vmax; bras; drill', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Wall Drill Double Switch', fid, 'speed_max | vmax; mur; double', '{Mur}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Wall Drill Single Switch', fid, 'speed_max | vmax; mur; simple', '{Mur}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('A Skip with Power', fid, 'speed_max | vmax; a_skip; puissance', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('B Skip with Power', fid, 'speed_max | vmax; b_skip; puissance', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Half Kneeling Arm Pump', fid, 'speed_max | vmax; bras; demi_genou', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Straight Leg Pulls', fid, 'speed_max | vmax; jambe_tendue; pull', '{none}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Cycle course élastique', fid, 'speed_max | technique_course; cyclage', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Gammes techniques têtes 45° + élastique', fid, 'technique | gamme; jeu_aérien; technique_action', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Gammes techniques volées 45° + élastique', fid, 'technique | gamme; frappe; technique_action', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Gamme technique triangle', fid, 'technique | gamme; coordination; triangle', '{Cônes}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint départ arrêté 5m', fid, 'acceleration | accélération; neuromusculaire', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint départ arrêté 10m', fid, 'acceleration | accélération; neuromusculaire', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint départ arrêté 20m', fid, 'acceleration | accélération', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint départ arrêté 30m', fid, 'acceleration | accélération', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint départ dos au sens de course', fid, 'acceleration | accélération; réactivité', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint départ assis au sol', fid, 'acceleration | accélération', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint départ genoux au sol', fid, 'acceleration | accélération', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint départ 4 pattes', fid, 'acceleration | accélération', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint depuis action technique', fid, 'acceleration | accélération; technique_action', '{Ballon}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint départ signal visuel', fid, 'acceleration | accélération; réactivité', '{Cônes colorés}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint départ signal sonore', fid, 'acceleration | accélération; réactivité', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('2 Point Start', fid, 'acceleration | départ; 2_points', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('3 Point Start', fid, 'acceleration | départ; 3_points', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Crouching Start', fid, 'acceleration | départ; accroupi', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ground Starts', fid, 'acceleration | départ; sol', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Resisted Ground Starts', fid, 'acceleration | départ; sol; résisté', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ball Drops', fid, 'acceleration | départ; réactif; temps_réaction', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mountain Climber Starts', fid, 'acceleration | départ; mountain_climber', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Jump Back Starts', fid, 'acceleration | départ; saut_arrière; réactif', '{none}', '{jump}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Partner Lean Start', fid, 'acceleration | départ; force_horizontale', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Half Kneeling Start', fid, 'acceleration | départ; demi_genou', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Push Up Start', fid, 'acceleration | départ; push_up; sol', '{none}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Single Leg Push Off', fid, 'acceleration | départ; unilat; push_off', '{none}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint résisté élastique 10m', fid, 'acceleration | accélération; force_horizontale; profil_fv', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint résisté élastique 20m', fid, 'acceleration | accélération; force_horizontale', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint résisté traîneau sled', fid, 'acceleration | accélération; sled', '{Traîneau}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint côte 6-8% 20m', fid, 'acceleration | accélération; force_horizontale; côte', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint côte 10-12% 20m', fid, 'acceleration | accélération; surcharge', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint côte 15% 10m', fid, 'coordination | puissance; surcharge', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Band Piston Sprint', fid, 'acceleration | départ; élastique; piston', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sled Resisted Sprint', fid, 'acceleration | sprint; sled; force_horizontale', '{Traîneau}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sled Push', fid, 'technique | traineau; poussé; football', '{Traîneau}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Skipping élastique résistance', fid, 'speed_max | skipping; élastique; résistance', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Flying sprint 10m (lancé depuis 20m)', fid, 'speed_max | vmax; neuromusculaire', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Flying sprint 20m', fid, 'speed_max | vmax', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Flying sprint 30m', fid, 'speed_max | vmax', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint 40m complet (accél+Vmax)', fid, 'speed_max | vmax; accélération', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint Vmax relâchement', fid, 'speed_max | vmax; relâchement', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint assisté élastique 20m (overspeed)', fid, 'speed_max | surcharge_vitesse; vmax', '{Élastique assisté}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dead Leg Run', fid, 'speed_max | vmax; dead_leg; drill', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Single Leg Cycling', fid, 'speed_max | vmax; cyclage; drill', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Low Box Hip Switches', fid, 'speed_max | vmax; hip_switch; drill', '{Box basse}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse en ligne droite', fid, 'speed_max | vmax; accélération', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Freinage bilatéral depuis marche', fid, 'cod | décélération; lca; apprentissage', '{none}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Freinage bilatéral depuis trot', fid, 'cod | décélération; lca', '{none}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Freinage bilatéral depuis sprint 10m', fid, 'cod | décélération; lca', '{none}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Freinage unilatéral droit depuis trot', fid, 'cod | décélération; lca; unilat', '{none}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Freinage unilatéral gauche depuis trot', fid, 'cod | décélération; lca', '{none}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Freinage latéral droit 2 appuis', fid, 'cod | décélération; lca; latéral', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Freinage latéral gauche 2 appuis', fid, 'cod | décélération; lca', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Freinage latéral 1 appui droit', fid, 'cod | décélération; lca; avancé', '{none}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Décélération progressive 30m→0', fid, 'cod | décélération; contrôle', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint 20m + freinage + réaccél 10m', fid, 'cod | décélération; réaccélération', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Decel Series', fid, 'cod | décélération; série; lca', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Décélération basse', fid, 'cod | décélération; basse; contrôle', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Décélération haute', fid, 'cod | décélération; haute; lca', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Décélération en fente traction élastique', fid, 'cod | décélération; fente; élastique', '{Élastique}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('RSA 6×30m / 20s récup', fid, 'conditioning | rsa; fatigue_cost=très_élevé', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('RSA 8×20m / 15s récup', fid, 'conditioning | rsa', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('RSA 10×15m / 12s récup', fid, 'conditioning | rsa; court', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('RSA avec COD 30m', fid, 'conditioning | rsa; cod; match-like', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint navette 5-10-5 répété ×5', fid, 'conditioning | rsa; cod', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('RAST test (6×35m / 10s)', fid, 'conditioning | rsa; test; évaluation', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Conduite et vitesse en navette', fid, 'conditioning | rsa; navette; technique_action', '{Ballon+cônes}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Intermittent répétition de tirs', fid, 'conditioning | rsa; technique_action; frappe', '{Ballon+but}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint depuis relance gardien', fid, 'coordination | sprint; match-like', '{Ballon}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint pressing haut 30m', fid, 'coordination | sprint; pressing; match-like', '{Cônes}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint transition défensive retour 40m', fid, 'coordination | sprint; transition; match-like', '{Cônes}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint + interception passe', fid, 'coordination | sprint; interception; match-like', '{Ballon+partenaire}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Step squat jump + vitesse + tir', fid, 'technique | sprint; step; technique_action; tir', '{Step+ballon}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Step skip latéral + foulées bondissantes + tir', fid, 'speed_max | sprint; skip; technique_action', '{Step+ballon}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Conduite de balle en navette', fid, 'technique | sprint; dribble; navette; technique_action', '{Ballon+cônes}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vitesse slalom avec et sans ballon', fid, 'technique | sprint; slalom; dribble', '{Ballon+cônes}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Test 5m chrono', fid, 'acceleration | test; évaluation; accélération', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Test 10m chrono', fid, 'coordination | test; évaluation', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Test 20m chrono', fid, 'coordination | test; évaluation; vitesse', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Test 30m chrono', fid, 'speed_max | test; évaluation; vmax', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Test flying 20m (vitesse lancée)', fid, 'speed_max | test; vmax; profil_fv; morin', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat jump (sans rebond)', fid, 'coordination | plio; impulsive', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Counter movement jump (CMJ)', fid, 'coordination | plio; réactive; cmj', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Drop jump depuis 30cm', fid, 'speed_max | plio; réactive; stiffness', '{Box 30cm}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Depth jump (drop + rebond immédiat)', fid, 'coordination | plio; réactive; très haute', '{Box}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Box jump (saut sur box)', fid, 'coordination | plio; concentrique', '{Box}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Split squat jump', fid, 'coordination | plio; unilat; coordination', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Tuck jump (genoux poitrine)', fid, 'coordination | plio; puissance', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('CMJ avec bras (max performance)', fid, 'coordination | plio; cmj; test', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('CMJ sur 1 jambe D', fid, 'prevention | plio; unilat; lca', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat Jump (OTA)', fid, 'coordination | plio; vertical; ota', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Knee Jump', fid, 'coordination | plio; vertical; genoux', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ascending Knee Jump', fid, 'coordination | plio; vertical; progressif', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Non-CM Box Jump', fid, 'coordination | plio; concentrique; sans_élan', '{Box}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Rebound Box Jump', fid, 'plyometric_power | plio; rebond; réactif', '{Box}', '{jump}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Seated Box Jump', fid, 'coordination | plio; sans_élan; concentrique', '{Box+banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Oscillatory Split Squat', fid, 'coordination | plio; oscillatoire; triphasic', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Snap Down', fid, 'prevention | plio; réactif; atterrissage; lca', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Russian Lunges', fid, 'coordination | plio; unilat; vertical', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Band Assisted Tuck Jumps', fid, 'coordination | plio; assisté; sécurité', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Band Resisted Squat Jump', fid, 'acceleration | plio; résisté; élastique', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Bounding horizontal (bonds filants)', fid, 'acceleration | plio; force_horizontale', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Saut en longueur sans élan', fid, 'acceleration | plio; test; force_horizontale', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Saut longueur + sprint immédiat (PAP)', fid, 'coordination | pap; plio; vitesse', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Triple saut sans élan', fid, 'lower_body_strength | plio; force_horiz', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Broad Jump', fid, 'lower_body_strength | plio; horizontal; force_horiz', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Broad Jump with plates', fid, 'lower_body_strength | plio; chargé; force_horiz', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Resisted Broad Jumps', fid, 'acceleration | plio; résisté; force_horiz', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Rebound Broad Jumps', fid, 'plyometric_power | plio; rebond; horizontal', '{none}', '{jump}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Double Broad Jump', fid, 'coordination | plio; double; horizontal', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Triple Broad Jump', fid, 'coordination | plio; triple; horizontal', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Bounds / Alternating Leg Bounds', fid, 'plyometric_power | plio; bonds; horizontal', '{none}', '{jump}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Bound to Sprint', fid, 'coordination | pap; plio; vitesse', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Power Skips', fid, 'speed_max | plio; skips; horizontal', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Half Kneeling Broad Jump', fid, 'coordination | plio; demi_genou; horizontal', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Seated Broad Jump', fid, 'coordination | plio; assis; concentrique', '{Banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Broad jump + détente + retour arrière', fid, 'plyometric_power | plio; horizontal; rebond', '{none}', '{jump}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pliométrie horizontale bondissement 1 jambe', fid, 'coordination | plio; horizontal; unilat', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Saut latéral bilatéral D→G', fid, 'coordination | plio; latéral; coordination', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Skater jump (patineurs) enchaînés', fid, 'cod | plio; latéral; cod', '{none}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lateral hurdle hop ×6 mini haies', fid, 'coordination | plio; latéral; haies', '{Mini-haies}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lateral Broad Jumps', fid, 'coordination | plio; latéral; horizontal', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Skater Jumps', fid, 'cod | plio; latéral; cod', '{none}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ascending Skater Jumps', fid, 'coordination | plio; latéral; progressif', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Reaction Skater Jumps', fid, 'coordination | plio; latéral; réactif', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Single Leg Lateral Bounds', fid, 'coordination | plio; latéral; unilat', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lateral Line Hops', fid, 'coordination | plio; latéral; réactif', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lateral Pogo Jumps', fid, 'speed_max | plio; latéral; stiffness', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Resisted Skater Hops', fid, 'acceleration | plio; latéral; résisté', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pliométrie latérale 1 pied haies', fid, 'coordination | plio; latéral; unilat; haies', '{Mini-haies}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pliométrie latérale 2 pieds haies', fid, 'coordination | plio; latéral; bilatéral; haies', '{Mini-haies}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Side jump plus 2ème détente', fid, 'plyometric_power | plio; latéral; rebond', '{none}', '{jump}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Retournement pliométrie', fid, 'cod | plio; rotation; cod', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pliométrie appuis extérieur et tour arrière', fid, 'cod | plio; latéral; rotation; cod', '{Cônes}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ankle stiffness rebonds rapides ×15', fid, 'speed_max | stiffness; cheville', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hurdle rebounds mini haies ×10', fid, 'speed_max | stiffness; haies', '{Mini-haies}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('In-place pogo jumps rapides', fid, 'speed_max | stiffness; fréquence', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pogo jumps avec déplacement avant', fid, 'speed_max | stiffness; déplacement', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stiffness mollets en montée côte', fid, 'speed_max | stiffness; côte; j-1', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pogo Jump', fid, 'speed_max | stiffness; pogo; réactif', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Resisted/Assisted Pogo Jump', fid, 'speed_max | stiffness; pogo; résisté', '{Élastique}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pulsing Pogos', fid, 'speed_max | stiffness; pulse', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mini Hurdle Hops', fid, 'speed_max | stiffness; haies; réactif', '{Mini haies}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pulsing Hurdle Hops', fid, 'speed_max | stiffness; haies; pulse', '{Mini haies}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pogo jump latéral', fid, 'speed_max | stiffness; latéral; pogo', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Complexe back squat lourd + CMJ', fid, 'coordination | pap; contrast_loading', '{Barre+rack}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Complexe hip thrust + bounding', fid, 'lower_body_strength | pap; force_horiz', '{Barre+banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Complexe RDL + bounding horizontal', fid, 'coordination | pap; chaîne_post', '{Barre}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('CMJ + sprint 10m (PAP)', fid, 'coordination | pap; vitesse', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Trap Bar Jumps', fid, 'coordination | pap; trap_bar; explosif', '{Trap bar}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Reactive Trap Bar Jumps', fid, 'coordination | pap; réactif; trap_bar', '{Trap bar}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('DB Eccentric Release Box Jump', fid, 'lower_body_strength | pap; excentrique; box', '{Box+haltères}', '{sprint}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('COD 45° droit', fid, 'cod | cod; 45deg', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('COD 45° gauche', fid, 'cod | cod; 45deg', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('COD 90° droit', fid, 'cod | cod; 90deg', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('COD 90° gauche', fid, 'cod | cod; 90deg', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Demi-tour 180° droit', fid, 'cod | cod; demi-tour', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pro agility test 5-10-5 D', fid, 'cod | cod; test; planifié', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('T-test', fid, 'cod | cod; test; multi-direction', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Illinois agility test', fid, 'cod | cod; test', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Zig-zag 6 plots 45°', fid, 'cod | cod; enchaîné', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Zig-zag 6 plots 90°', fid, 'cod | cod; enchaîné', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stop and Go', fid, 'cod | cod; stop; go', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Short Shuttle', fid, 'cod | cod; navette', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Y Cut Drill', fid, 'cod | cod; y_cut; réorientation', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Jump Cut Drill', fid, 'plyometric_power | cod; jump_cut; plio', '{Cônes}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Quarter Arc', fid, 'cod | cod; arc; courbe', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Full Arc or Circle Run', fid, 'cod | cod; cercle; courbe; football', '{Cônes}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('vitesse triangle', fid, 'cod | cod; triangle', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('vitesse conduite carré', fid, 'cod | cod; carré; technique_action', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('COD réactif signal visuel', fid, 'cod | agilité; réactif; décision', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('COD réactif cône couleur (4 choix)', fid, 'cod | agilité; réactif; décision', '{Cônes colorés}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Shadow drill', fid, 'cod | agilité; réactif', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Miroir 1v1 défenseur', fid, 'cod | agilité; match-like', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Catch ball + COD', fid, 'cod | agilité; coordination; réactif', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lateral Shuffle with Ball React', fid, 'cod | cod; shuffle; réactif', '{none}', '{shuffle}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lateral Shuffle Mirror Drill', fid, 'cod | cod; miroir; réactif', '{none}', '{decel}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Y Cut Drill with Reaction', fid, 'cod | cod; y_cut; réactif', '{Cônes+signal}', '{decel}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Jump Cut Drill with Reaction', fid, 'plyometric_power | cod; jump_cut; réactif', '{Cônes+signal}', '{jump}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Carioca Run', fid, 'cod | cod; carioca; latéral', '{none}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lateral Shuffle', fid, 'cod | cod; shuffle; latéral', '{none}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Resisted Lateral Shuffle', fid, 'acceleration | cod; shuffle; résisté', '{Élastique}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lateral Power Shuffle', fid, 'cod | cod; power; shuffle', '{none}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Power Shuffle to Sprint', fid, 'cod | cod; shuffle; sprint', '{Cônes}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Crossover Run', fid, 'cod | cod; croisé; vitesse', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Power Carioca', fid, 'cod | cod; carioca; puissance', '{none}', '{shuffle}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Crossover Bounds', fid, 'plyometric_power | cod; bonds; croisés', '{none}', '{jump}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Appuis 2 jumps latéraux sur step', fid, 'plyometric_power | cod; latéral; step; jump', '{Step}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Décélération 10m + réaccélération 10m D', fid, 'acceleration | réaccélération; cod; lca', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Décélération 10m + réaccélération 10m G', fid, 'acceleration | réaccélération; cod', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint 20m + COD 90° + sprint 10m', fid, 'speed_max | cod; vmax; réaccélération', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('COD sous fatigue RSA', fid, 'conditioning | cod; rsa; fatigue', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Accelerate to Back Pedal', fid, 'cod | cod; rétropédalage', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Backpedal to Hip Flip', fid, 'cod | cod; rétro; flip', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Back Pedal to Accelerate', fid, 'acceleration | cod; rétro; accélération', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Slalom 10 plots 2m écart', fid, 'coordination | cod; slalom; coordination', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ladder : 1 pied par case avant', fid, 'coordination | coordination; fréquence_appuis', '{Échelle}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ladder : latéral 2 pieds par case', fid, 'coordination | coordination; latéral', '{Échelle}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ladder : Icky shuffle', fid, 'coordination | coordination; fréquence; avancé', '{Échelle}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Appuis 45° rapides plots', fid, 'coordination | appuis; 45deg; plots', '{Plots}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Appuis avant diagonale plots', fid, 'coordination | appuis; diagonale; plots', '{Plots}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Appuis latéral rapide plots', fid, 'cod | appuis; latéral; plots', '{Plots}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Appuis sur plot 8', fid, 'coordination | appuis; 8; plots', '{Plots}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Cerceaux appuis latéraux + tours', fid, 'coordination | appuis; cerceaux; tours', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Circuit appuis endurance', fid, 'cod | cod; circuit; endurance', '{Plots}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Slalom tour avant arrière', fid, 'cod | cod; slalom; tour', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'COD' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Slalom déplacement latéral', fid, 'cod | cod; slalom; latéral', '{Cônes}', '{decel}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Échelle 3:4 avant', fid, 'coordination | coordination; échelle; 3:4', '{Échelle}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Échelle fermeture ouverture', fid, 'coordination | coordination; échelle; ouverture', '{Échelle}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Échelle griffé', fid, 'coordination | coordination; échelle; griffé', '{Échelle}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Échelle cloche pied latéral', fid, 'coordination | coordination; échelle; cloche_pied', '{Échelle}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Back squat', fid, 'lower_body_strength | force_max; bilatéral', '{Barre+rack}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Front squat', fid, 'lower_body_strength | force_max; core', '{Barre+rack}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Trap bar deadlift', fid, 'lower_body_strength | force_max; fonctionnel', '{Trap bar}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Romanian deadlift (RDL)', fid, 'lower_body_strength | chaîne_post; ischios; excentrique', '{Barre/haltères}', '{sprint}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Goblet squat', fid, 'lower_body_strength | force; mobilité; accessible', '{Kettlebell}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Leg press', fid, 'lower_body_strength | force; quadriceps', '{Machine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat bodyweight', fid, 'coordination | bodyweight; quadriceps', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Box Squat', fid, 'lower_body_strength | squat; force_max; pause', '{Barre+box}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Overhead Squat', fid, 'lower_body_strength | squat; mobilité; épaules', '{Barre}', '{squat}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Iso Extreme Sumo Squat', fid, 'lower_body_strength | squat; iso; adducteurs', '{Haltère}', '{squat}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Band TriPhasic Squat', fid, 'lower_body_strength | squat; triphasique; triphasic', '{Barre+bandes}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Landmine Squat', fid, 'lower_body_strength | squat; landmine; accessible', '{Barre+coin}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pistol Squat', fid, 'lower_body_strength | squat; unilat; avancé', '{Aucun/TRX}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Spanish Squat ISO', fid, 'lower_body_strength | squat; isométrique; tendinite', '{Élastique}', '{squat}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Spanish Squats', fid, 'lower_body_strength | squat; quadriceps; tendon_rotulien', '{Élastique+appui}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Conventional Deadlift', fid, 'lower_body_strength | deadlift; force_max', '{Barre}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Deficit Deadlift', fid, 'lower_body_strength | deadlift; déficit; surcharge', '{Barre+plateforme}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Rack Pulls', fid, 'lower_body_strength | deadlift; force_max; partiel', '{Barre+rack}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat stato-dynamique', fid, 'lower_body_strength | squat; stato-dynamique; iso', '{Barre/haltères}', '{squat}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat russes', fid, 'lower_body_strength | squat; russien; genou', '{Barre légère}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat TRX', fid, 'lower_body_strength | squat; trx; accessible', '{TRX}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('TRX squat 1 jambe', fid, 'lower_body_strength | squat; unilat; trx', '{TRX}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Bulgarian split squat', fid, 'lower_body_strength | force; unilat; fessiers', '{Haltères/barre}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente avant marchée', fid, 'lower_body_strength | force; unilat; mobilité', '{Haltères}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Step-up explosif droit', fid, 'lower_body_strength | force; unilat; puissance', '{Box+haltères}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Single leg squat (pistol partiel)', fid, 'lower_body_strength | force; unilat; avancé', '{Aucun/TRX}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Elevated Reverse Lunge', fid, 'lower_body_strength | fente; élevée; quadriceps', '{Banc+haltères}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Goblet Stationary Lateral Lunge', fid, 'lower_body_strength | fente; latérale; adducteurs', '{Kettlebell}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Iso-Extreme Split Squats', fid, 'lower_body_strength | fente; iso; triphasic', '{Haltères}', '{lunge}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('DB Oscillatory Bulgarian Split Squats', fid, 'lower_body_strength | fente; oscillatoire; triphasic', '{Haltères}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Iso Bulgarian Split Squats', fid, 'lower_body_strength | fente; iso; bulgarian', '{Banc}', '{lunge}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Curtsy Lunge', fid, 'lower_body_strength | fente; latérale; fessiers', '{Haltères}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Barbell Split Squat', fid, 'lower_body_strength | fente; barre; force_max', '{Barre}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes isométriques barre', fid, 'lower_body_strength | fente; isométrique; barre', '{Barre}', '{lunge}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fentes bulgares haltères', fid, 'lower_body_strength | fente; bulgarian; haltères', '{Haltères}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hip thrust barre', fid, 'lower_body_strength | fessiers; sprint; hip_thrust', '{Barre+banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hip thrust unilatéral D', fid, 'coordination | fessiers; unilat', '{Banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Glute bridge bilatéral', fid, 'coordination | fessiers; activation', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Kettlebell swing bilatéral', fid, 'coordination | chaîne_post; explosif; cardio', '{Kettlebell}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Banded KB Swing', fid, 'coordination | chaîne_post; élastique', '{KB+élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Cable Pull Throughs', fid, 'coordination | chaîne_post; hip_extension', '{none}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hanging Snatch High Pull', fid, 'coordination | explosif; chaîne_post; power', '{Barre}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hang Clean', fid, 'coordination | olympic; chaîne_post; power', '{Barre}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Single Leg Glute Bridge with Opposite Tucked', fid, 'coordination | fessiers; unilat', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Iso-Single Leg Hip Thrust', fid, 'lower_body_strength | fessiers; iso; hip_thrust', '{Banc}', '{sprint}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hamstring Focus Glute Bridge', fid, 'coordination | fessiers; ischios', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hip thrust lombaires + élastique', fid, 'trunk_extension | fessiers; lombaires; élastique', '{Élastique+banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Spanish squat isométrique', fid, 'lower_body_strength | isométrique; quadriceps; tendinite', '{Élastique}', '{sprint}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Wall sit bilatéral', fid, 'lower_body_strength | isométrique; quadriceps', '{Mur}', '{sprint}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Contraction isométrique adducteurs', fid, 'lower_body_strength | isométrique; adducteurs; prévention', '{none}', '{sprint}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mid-thigh pull isométrique', fid, 'lower_body_strength | isométrique; force_max; test', '{Barre+rack}', '{sprint}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Iso-Extreme Squat', fid, 'lower_body_strength | squat; iso; tendineux', '{none}', '{squat}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('BB Iso Squats', fid, 'lower_body_strength | squat; iso; barre', '{Barre+rack}', '{squat}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Isometric Trap Bar Deadlift Staggered', fid, 'lower_body_strength | deadlift; iso; unilat', '{Trap bar+rack}', '{hinge}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Isometric Trap Bar Deadlift Standard', fid, 'lower_body_strength | deadlift; iso; force_max', '{Trap bar+rack}', '{hinge}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Overcoming Iso Trap Bar Split Lunge', fid, 'lower_body_strength | fente; iso; overcoming', '{Trap bar+rack}', '{lunge}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hex bar jump (force-vitesse)', fid, 'plyometric_power | force_vitesse; puissance', '{Trap bar}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Back squat force-vitesse (>0.8 m/s)', fid, 'plyometric_power | force_vitesse; profil_fv', '{Barre+chrono vel}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hip thrust force-vitesse', fid, 'lower_body_strength | force_vitesse; fessiers; sprint', '{Barre légère}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sled March', fid, 'acceleration | sled; force_horizontale; position_basse', '{Traîneau}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sled Sprints', fid, 'acceleration | sled; sprint; force_horizontale', '{Traîneau}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sled Drag', fid, 'acceleration | sled; drag; chaîne_post', '{Traîneau}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Trap barre dead lift jump squat', fid, 'plyometric_power | force_vitesse; trap_bar; jump', '{Trap bar}', '{jump}', '{stretch_shortening}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Back squat excentrique lent (4s)', fid, 'lower_body_strength | excentrique; hypertrophie; contrôle', '{Barre}', '{sprint}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('RDL excentrique 4s descendant', fid, 'lower_body_strength | excentrique; ischios; prévention', '{Barre}', '{sprint}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Nordic hamstring flywheel', fid, 'lower_body_strength | excentrique; ischios; flywheel', '{none}', '{sprint}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Calf raise excentrique (4s)', fid, 'acceleration | excentrique; cheville; achille', '{Marche/box}', '{sprint}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('DB/BB Oscillatory Split Squats', fid, 'lower_body_strength | fente; oscillatoire; triphasique', '{Haltères/barre}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Eccentric Chin Ups', fid, 'lower_body_strength | dos; excentrique; traction', '{Barre traction}', '{sprint}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat RLD élastique (excentrique)', fid, 'lower_body_strength | chaîne_post; excentrique; élastique', '{Élastique}', '{sprint}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fente bodyweight alternée', fid, 'coordination | bodyweight; unilat', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Push-up classique', fid, 'coordination | bodyweight; poussée', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pull-up (traction)', fid, 'coordination | bodyweight; dos', '{Barre traction}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat avec bande élastique', fid, 'lower_body_strength | force; élastique; accessible', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hip thrust avec bande', fid, 'coordination | fessiers; élastique', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Abduction hanche avec bande', fid, 'prevention | abducteurs; élastique', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Squat avec tension élastique derrière genou', fid, 'lower_body_strength | squat; élastique; genou', '{Élastique}', '{squat}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Plantar/Dorsi Flexion', fid, 'mobility | cheville; mobilité; plantar', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Heel Walks', fid, 'prevention | tibialis; cheville; prévention', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Heel to Toe Walks', fid, 'coordination | cheville; coordination', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Toe Walks', fid, 'lower_body_strength | mollets; activation', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Seated Calf Raise', fid, 'acceleration | soleus; achille', '{Machine/haltère}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Standing Calf Raise', fid, 'acceleration | mollets; achille', '{Marche/machine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Single Leg Wall Calf Raise', fid, 'acceleration | mollets; unilat; achille', '{Mur}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mollets donkey', fid, 'lower_body_strength | mollets; donkey', '{Machine/banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Montées sur pointe de pied', fid, 'lower_body_strength | mollets; activation', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('marche mollets', fid, 'lower_body_strength | mollets; marche; activation', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Nordic hamstring standard', fid, 'lower_body_strength | ischios; excentrique; prévention; critique', '{none}', '{sprint}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Nordic hamstring progression 45°', fid, 'coordination | ischios; progression', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Askling L-protocol — Glider', fid, 'arms_biceps | ischios; biceps_fémoral; askling', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Askling L-protocol — Supine', fid, 'coordination | ischios; askling', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Askling L-protocol — Running', fid, 'coordination | ischios; askling; course', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Romanian deadlift excentrique lent', fid, 'lower_body_strength | ischios; excentrique; rdl', '{Barre/haltères}', '{hinge}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Flywheel excentrique ischios', fid, 'lower_body_strength | ischios; flywheel; excentrique', '{none}', '{sprint}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Single Leg Swiss Ball Hamstring ISO', fid, 'coordination | ischios; iso; swiss_ball', '{none}', '{sprint}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Single Leg Swiss Ball Hamstring Curl', fid, 'coordination | ischios; curl; swiss_ball', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Swiss Ball Hamstring Curl', fid, 'coordination | ischios; curl; accessible', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Reverse Nordics', fid, 'lower_body_strength | quadriceps; excentrique; prévention', '{none}', '{sprint}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Banded Hamstring Curl', fid, 'coordination | ischios; élastique; accessible', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Iso Nordic Hamstring Curls', fid, 'coordination | ischios; iso; nordic', '{none}', '{sprint}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lombaires ischios montées sur une jambe', fid, 'trunk_extension | ischios; lombaires; unilat', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Copenhagen side plank genou', fid, 'prevention | adducteurs; copenhagen; prévention', '{Banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Copenhagen pied', fid, 'coordination | adducteurs; copenhagen; avancé', '{Banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Copenhagen 311 drill', fid, 'lower_body_strength | adducteurs; 311; excentrique; tous', '{Banc}', '{sprint}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Copenhagens adducteurs', fid, 'coordination | adducteurs; copenhagen', '{Banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('trx copenhagen', fid, 'coordination | adducteurs; trx; copenhagen', '{TRX}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lateral band walk valgus', fid, 'prevention | lca; valgus; prévention', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Jump landing bilatérale', fid, 'speed_max | lca; réception; biomécanique', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Jump landing unilatérale D', fid, 'prevention | lca; unilat; réception', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Single leg squat contrôle valgus', fid, 'lower_body_strength | lca; valgus; force', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Step down excentrique', fid, 'lower_body_strength | lca; excentrique; quadriceps', '{Box}', '{sprint}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('DB Snap Downs', fid, 'prevention | snap_down; lca; réactif', '{Haltères}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Genou flexion extension avec détente et élastique', fid, 'prevention | lca; genou; élastique', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Soleus raise bilatéral lent', fid, 'acceleration | cheville; achille; charge_progressive', '{Marche/box}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Single leg calf raise excentrique 4s', fid, 'acceleration | achille; excentrique; alfredson', '{Marche/box}', '{sprint}', '{eccentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Heavy slow resistance (Achille)', fid, 'acceleration | achille; hsr; tendinopathie', '{Machine/barre}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Plateau wobble bilatéral', fid, 'proprioception | cheville; proprioception; équilibre', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Plateau wobble unilatéral D', fid, 'proprioception | cheville; proprioception; unilat', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ankle mobility drill (genou mur)', fid, 'mobility | cheville; mobilité; avant_seance', '{Mur}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sever protocol progressif', fid, 'coordination | sever; pathologie; u9', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('External rotation élastique', fid, 'prevention | épaule; rotateurs; prévention; gardien', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Internal rotation élastique', fid, 'prevention | épaule; rotateurs', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Prone Y-T-W', fid, 'proprioception | épaule; scapulaire; stabilité', '{Haltères légers}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Face pull élastique', fid, 'coordination | épaule; postérieure; gardien', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Scarecrows', fid, 'prevention | épaule; rotateurs; scapulaire', '{Haltères}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Band Scarecrows', fid, 'prevention | épaule; rotateurs; prévention', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dump the Buckets', fid, 'coordination | épaule; rotation_externe', '{Haltères}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Kneeling Band Scarecrow', fid, 'prevention | épaule; rotateurs; genou', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('épaule rotation interne haute élastique', fid, 'coordination | épaule; ri; haute', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Cat-cow lombaire', fid, 'trunk_extension | lombaires; mobilité; avant_seance', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Bird dog', fid, 'trunk_extension | lombaires; stabilité', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Superman 4 pattes', fid, 'trunk_extension | lombaires; chaîne_post', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('gainage lombaire sur les mains', fid, 'trunk_extension | lombaires; gainage; mains', '{none}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('lombaires superman', fid, 'trunk_extension | lombaires; superman', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('lombaires superman alterné', fid, 'trunk_extension | lombaires; alterné', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lombaires brasse avant', fid, 'trunk_extension | lombaires; brasse; extension', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('pike trx abs lombaires', fid, 'trunk_extension | lombaires; trx; pike', '{TRX}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('trx planche lombaire 1 jambe', fid, 'trunk_extension | lombaires; trx; unilat', '{TRX}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lateral band walk abducteurs', fid, 'prevention | abducteurs; activation', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('élastique rotateurs hanche à genou', fid, 'prevention | hanche; rotateurs; élastique', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité adducteurs 4 pattes', fid, 'mobility | adducteurs; 4_pattes; mobilité', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité adducteurs à genoux', fid, 'mobility | adducteurs; genou; mobilité', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Séquence mobilité adducteurs', fid, 'mobility | adducteurs; séquence; mobilité', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('mobilité adducteurs rythmée', fid, 'coordination | adducteurs; rythmée', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('15-15 VMA', fid, 'conditioning | pma; 15-15; buchheit; vo2max', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('30-30 VMA', fid, 'conditioning | pma; 30-30; buchheit', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Séance 30-15 IFT à 95%', fid, 'conditioning | pma; 30-15; training', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('10-10 (10s sprint / 10s récup)', fid, 'conditioning | pma; très_court', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('INTERMITTENT 10-10', fid, 'conditioning | intermittent; 10-10', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('INTERMITTENT 15-15', fid, 'conditioning | intermittent; 15-15', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('INTERMITTENT 20-20', fid, 'conditioning | intermittent; 20-20', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('INTERMITTENT 30-30', fid, 'conditioning | intermittent; 30-30', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('INTERMITTENT 10-20', fid, 'conditioning | intermittent; 10-20; dissymétrique', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('INTERMITTENT 5-25', fid, 'conditioning | intermittent; 5-25; court_effort', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Intermittent 16m-16m / récup active 40m', fid, 'conditioning | intermittent; 16m; récup_active', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Intermittent 1min-1min', fid, 'conditioning | intermittent; 1min', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('intermittent conduite carré', fid, 'conditioning | intermittent; conduite; football', '{Ballon+cônes}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('intermittent triangle', fid, 'conditioning | intermittent; triangle; football', '{Cônes}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Course continue seuil 20-30min', fid, 'conditioning | seuil; lactique; aérobie', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('PMA côte 30s effort', fid, 'acceleration | pma; côte; buchheit', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Fartlek libre', fid, 'conditioning | fartlek; aérobie; varié', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('PMA courses de 40m', fid, 'conditioning | pma; 40m; répétitions', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Course pressing triangle', fid, 'coordination | course; pressing; triangle', '{Cônes}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('RSA terrain 6×30m / 20s', fid, 'conditioning | rsa; fatigue_cost=très_élevé', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Navette vitesse', fid, 'conditioning | rsa; navette; vitesse', '{Cônes}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('vitesse navette conduite de balle', fid, 'conditioning | rsa; navette; technique_action', '{Ballon+cônes}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SSG 1v1 zone étroite', fid, 'conditioning | ssg; conditioning; football', '{Ballon+cônes}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SSG 3v3 terrain moyen', fid, 'conditioning | ssg; 3v3; conditioning', '{Ballon+buts}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SSG 5v5 grand terrain', fid, 'conditioning | ssg; 5v5', '{Ballon+buts}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('SSG pressing intensif', fid, 'conditioning | ssg; pressing; intensif', '{Ballon+buts}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('intermittent sur tapis de course', fid, 'conditioning | conditioning; tapis; alternatif', '{Tapis de course}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('HIIT circuit 4 stations', fid, 'hiit | hiit; circuit', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Stretch' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vélo récupération post-match', fid, 'recovery | récupération; vélo; post_match', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Stretch' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Compensation remplaçant post-match', fid, 'recovery | récupération; remplaçant; gps', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Course sur tapis', fid, 'conditioning | récupération; tapis; aérobie', '{Tapis de course}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Stretch' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Course sur tapis incurvé', fid, 'recovery | récupération; tapis_incurvé', '{Tapis incurvé}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ramper sous obstacle', fid, 'coordination | motricité; u9', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lancer-attraper balle 2 mains', fid, 'coordination | coordination; u9', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Équilibre unipodal D yeux ouverts', fid, 'proprioception | équilibre; u9', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Saut à la corde simple rythmique', fid, 'speed_max | stiffness; coordination; u9', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ladder : 1 pied par case rapide', fid, 'coordination | fréquence_appuis', '{Échelle}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Cônes hautes fréquences (jeu de pieds)', fid, 'coordination | fréquence_appuis; football', '{Cônes}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Skipping latérale élastique', fid, 'coordination | coordination; latéral; élastique', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Vitesse' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Skipping slalom', fid, 'speed_max | coordination; slalom; skipping', '{Cônes}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Signal visuel → sprint direction imposée', fid, 'coordination | réaction; décision', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Réaction + sprint + réception balle', fid, 'technique | réaction; technique_action', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dissociation haut/bas', fid, 'coordination | dissociation; coordination', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Jonglerie pied simple', fid, 'technique | jongle; technique_action', '{Ballon}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Contrôle pied + passe murale', fid, 'technique | contrôle; passe', '{Ballon+mur}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Rondo 4v1', fid, 'coordination | rondo; coordination', '{Ballon+partenaires}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Conduite slalom', fid, 'technique | coordination; dribble; slalom', '{Ballon+cônes}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('vitesse départ switch jambes', fid, 'coordination | coordination; switch; vitesse', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('gammes techniques tête + appuis latéral et avant', fid, 'coordination | coordination; tête; appuis', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Contrôle orienté + accélération 10m', fid, 'technique | technique_action; contrôle_orienté', '{Ballon}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint 20m + frappe au but directe', fid, 'technique | technique_action; frappe; sprint', '{Ballon+buts}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprint + centre dans la course', fid, 'technique | technique_action; centre; ailier', '{Ballon+buts}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Step squat jump 1 pied + vitesse + tir', fid, 'technique | technique_action; unilat; tir', '{Step+ballon+but}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Frappe pied droit puissance', fid, 'technique | frappe; puissance; pied_droit', '{Ballon+but}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Frappe pied gauche puissance', fid, 'technique | frappe; puissance; pied_gauche', '{Ballon+but}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Frappe précision cible D', fid, 'technique | frappe; précision', '{Ballon+buts}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Tir en pivot (demi-tour + frappe)', fid, 'technique | frappe; pivot; attaquant', '{Ballon+but}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Frappe de la tête (en saut)', fid, 'technique | jeu_aérien; tête; frappe', '{Ballon+partenaire}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Frappe D après 30s intermittent', fid, 'technique | technique_action; fatigue; frappe', '{Ballon+buts}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Contrôle + passe après sprint', fid, 'technique | technique_action; fatigue; passe', '{Ballon+partenaire}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Décision tactique en fatigue', fid, 'technique | technique_action; fatigue; décision', '{Ballon+partenaires}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('vitesse départ pré travail ischio', fid, 'acceleration | vitesse; départ; ischios; activation', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Technique de base' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Jeu de tête défensif', fid, 'technique | jeu_aérien; défensif', '{Ballon+partenaire}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Gardien — plongeon latéral D', fid, 'coordination | gardien; plongeon', '{Ballon+filet}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Gardien — sortie aérienne + poing', fid, 'coordination | gardien; sortie; aérien', '{Ballon+partenaire}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hip rotation 90/90 (CARs)', fid, 'mobility | mobilité; hanches; avant_seance', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ankle mobility drill', fid, 'mobility | mobilité; cheville; avant_seance', '{Mur}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Inchworm', fid, 'mobility | mobilité; full_body; avant_seance', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('World''s greatest stretch', fid, 'mobility | mobilité; full_body; avant_seance', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Leg swing avant-arrière D', fid, 'mobility | mobilité; hanches; avant_seance', '{Appui mur}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Leg swing latéral D', fid, 'mobility | mobilité; latéral; avant_seance', '{Appui mur}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Deep squat hold', fid, 'coordination | amplitude; hanches; avant_seance', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Couch Stretch', fid, 'mobility | hip_flexor; psoas; avant_seance', '{Aucun/mur}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('90/90 Stretch', fid, 'mobility | hanche; rotation; mobilité', '{none}', '{rotation}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pigeon', fid, 'coordination | fessiers; rotation_externe', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Frog', fid, 'mobility | adducteurs; amplitude; mobilité', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Cossack Squat', fid, 'lower_body_strength | adducteurs; squat; mobilité', '{none}', '{squat}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hip CARs', fid, 'mobility | hanche; cars; articulaire', '{none}', '{sprint}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Proprioception' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hip Airplanes', fid, 'proprioception | hanche; rotation; équilibre', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Bretzel Stretch', fid, 'mobility | global; rotation; mobilité', '{none}', '{rotation}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité dynamiques hanches debout', fid, 'coordination | hanches; dynamique; avant_seance', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité Scorpion', fid, 'mobility | mobilité; scorpion; thoracique', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité roulement sur le dos', fid, 'mobility | mobilité; dos; roulement', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité 4 appuis', fid, 'coordination | mobilité; 4_appuis; fonctionnel', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité ciseau chandelle', fid, 'mobility | mobilité; chandelle; ciseau', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('mobilité exterieure rythmée', fid, 'mobility | mobilité; extérieure; rythmée', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('mobilité griffé + allongée', fid, 'mobility | mobilité; griffé; allongée', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Clamshell (abducteurs)', fid, 'prevention | activation; fessiers; abducteurs', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Monster walk avant', fid, 'prevention | activation; abducteurs', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Glute bridge activation', fid, 'coordination | activation; fessiers', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dead bug activation', fid, 'trunk_extension | activation; core; lombaires', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Prone External Rotations', fid, 'prevention | épaule; re; prévention', '{Haltères légers}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Bench Lat Mobility', fid, 'conditioning | mobilité; dorsal; thoracique', '{Banc}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Quadriceps stretch D', fid, 'mobility | quadriceps; stretching; apres_seance', '{none}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Ischios stretch D', fid, 'mobility | ischios; stretching; apres_seance', '{none}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mollets stretch D', fid, 'lower_body_strength | mollets; cheville; apres_seance', '{Mur}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hip flexor stretch D', fid, 'mobility | hip_flexor; psoas; apres_seance', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hip Flexor Stretch', fid, 'mobility | hip_flexor; accessible; apres_seance', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Half Split', fid, 'mobility | ischios; stretch', '{none}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Butterfly', fid, 'mobility | adducteurs; stretch', '{none}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Half Kneeling Achilles + Ankle Rockers', fid, 'acceleration | achille; cheville; mobilité', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Banded Lying Hamstring Stretch', fid, 'coordination | ischios; allongé; élastique', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Tibialis Raise', fid, 'prevention | tibialis; shin_splints; prévention', '{Mur}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Band Pancake Stretch', fid, 'coordination | adducteurs; pancake', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('stretch TFL', fid, 'mobility | tfl; stretch; apres_seance', '{none}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('stretch soléaire', fid, 'acceleration | soléaire; achille; apres_seance', '{Mur}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stretch Ischios', fid, 'mobility | ischios; stretch; apres_seance', '{none}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Stretch' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Foam roller quadriceps', fid, 'recovery | foam_roller; récupération; apres_seance', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Foam roller ischios', fid, 'coordination | foam_roller; ischios; apres_seance', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Foam roller mollets', fid, 'lower_body_strength | foam_roller; mollets', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Stretch' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Respiration diaphragmatique', fid, 'recovery | récupération; snc; respiration', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pec Minor Stretch', fid, 'coordination | pec_mineur; épaule; posture', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lat Stretch', fid, 'conditioning | dorsal; étirement', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Cactus Stretch', fid, 'coordination | thoracique; rotation', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sleeper Stretch', fid, 'coordination | épaule; rotation; gardien', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Neck CARs', fid, 'mobility | cou; cars; articulaire', '{none}', '{sprint}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Back Bend', fid, 'coordination | extension; thoracique; colonne', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Stretch' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Mobilité axiale penché', fid, 'recovery | mobilité; axiale; récupération', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Stretch' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('mobilité au sol', fid, 'recovery | mobilité; sol; récupération', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stretch psoas + mobilité', fid, 'mobility | psoas; mobilité; stretch', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Band Pec Minor Stretch', fid, 'coordination | pec_mineur; élastique', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Band Lat Stretch', fid, 'conditioning | dorsal; élastique', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Backpack Stretch', fid, 'coordination | épaule; postérieure', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lateral Neck Stretch', fid, 'coordination | cou; cervical', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Neck Rotation', fid, 'coordination | cou; rotation', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Overhead Band Lat Stretch', fid, 'conditioning | dorsal; overhead', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('4 Way Neck Stretch', fid, 'coordination | cou; 4_directions', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Bicep Stretch', fid, 'shoulders | biceps; épaule; gardien', '{Mur}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Planche frontale forearm', fid, 'core_static | core; anti-extension', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Planche sur mains', fid, 'core_static | core; anti-extension', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dead bug classique', fid, 'core_static | core; anti-extension; psoas', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dead bug avancé', fid, 'core_static | core; anti-extension; avancé', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hollow body hold', fid, 'core_static | core; anti-extension; gymnique', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Superman', fid, 'trunk_extension | core; lombaires', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Plank Walkouts', fid, 'core_static | core; anti-extension; walkout', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Plank Pressups', fid, 'core_static | core; push; planche; combiné', '{none}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hollow Holds', fid, 'core_static | core; hollow; anti-extension', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dragon Flags', fid, 'core_static | core; dragon_flag; avancé', '{Banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Seal Walks', fid, 'core_static | core; déplacement; épaule', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Bear Crawls', fid, 'core_static | core; quadrupède; ours', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lateral Bear Crawl', fid, 'core_static | core; ours; latéral', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Plank Shoulder Taps', fid, 'core_static | core; épaule; anti-rotation', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Plank Kettlebell Drag Through', fid, 'core_static | core; anti-rotation; kb', '{Kettlebell}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Wheel Rollouts', fid, 'core_static | core; anti-extension; rollout', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Planche', fid, 'core_static | core; planche; anti-extension', '{none}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Planche sur les bras', fid, 'core_static | core; planche; bras', '{none}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Planche + genoux', fid, 'core_static | core; planche; genoux; dynamique', '{none}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS Planche + poussée jambe', fid, 'core_static | core; planche; jambe; dynamique', '{none}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS dead bug', fid, 'core_static | core; dead_bug', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('abs élastique dead bug rythmé', fid, 'core_static | core; dead_bug; élastique', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('abs élastique dead bug statique', fid, 'core_static | core; dead_bug; iso; élastique', '{Élastique}', '{sprint}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Abs planche sur ballon + mountain climber', fid, 'core_static | core; planche; ballon; mountain', '{Ballon}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Planche latérale D', fid, 'core_static | core; latéral', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Planche latérale G', fid, 'core_static | core; latéral', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pallof press bilatéral', fid, 'core_static | core; anti-rotation; pallof', '{Élastique}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Chop haut-bas', fid, 'core_static | core; rotation; fonctionnel', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Suitcase carry', fid, 'core_static | core; anti-flexion; carry', '{Haltère lourd}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pallof Press Walkouts', fid, 'core_static | core; anti-rotation; walkout', '{Élastique}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Stir the Pot', fid, 'core_static | core; stir_the_pot; instabilité', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Cable Anti Rotation', fid, 'core_static | core; anti-rotation; câble', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Rolling Planks', fid, 'core_static | core; rotation; dynamique', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Unilateral Front Rack KB March', fid, 'core_static | core; anti-rotation; kb', '{Kettlebell}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Single Arm Overhead Carry', fid, 'core_static | core; overhead; carry', '{Haltère}', '{carry}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Kneeling Pallof Press', fid, 'core_static | core; anti-rotation; genou', '{Élastique}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Side Plank DB Raise', fid, 'core_static | core; latéral; épaule', '{Haltère}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Side Plank Band Row', fid, 'core_static | core; latéral; tirage', '{Élastique}', '{pull}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ABS planche et adducteurs', fid, 'core_static | core; latéral; adducteurs', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Rotations 2 élastique', fid, 'core_static | core; rotation; élastique', '{Élastique}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('élastique rotations en fente', fid, 'lower_body_strength | core; rotation; fente', '{Élastique}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('abs élastique rotations à genou', fid, 'core_static | core; rotation; genou; élastique', '{Élastique}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Crunch classique', fid, 'core_static | core; concentrique', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Bicycle crunch', fid, 'core_static | core; rotation; dynamique', '{none}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Weighted Sit Ups', fid, 'core_static | core; lesté; flexion', '{Haltère}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprinter Sit Ups', fid, 'core_static | core; sprinter; dynamique', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('V Ups', fid, 'core_static | core; v_up; avancé', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Leg Lifts', fid, 'core_static | core; hip_flexor; flexion', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Flutter Kicks', fid, 'core_static | core; endurance', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Reverse Crunch', fid, 'core_static | core; bas; flexion_hanche', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('abs trx rameur inversé', fid, 'core_abs | core; rameur; trx; inversé', '{TRX}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('abs trx montées de genoux', fid, 'core_static | core; trx; genoux', '{TRX}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lombaires ischios 1 jambe ballon', fid, 'trunk_extension | lombaires; ischios; ballon; unilat', '{Ballon}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lombaires ischios 2 jambes ballon', fid, 'trunk_extension | lombaires; ischios; ballon', '{Ballon}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Prone Cobra', fid, 'trunk_extension | lombaires; mobilité; extension', '{none}', '{carry}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Supermans', fid, 'trunk_extension | lombaires; fessiers; extension', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hyperextensions', fid, 'lower_body_strength | lombaires; force', '{Banc GHD}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hyperextension with Twist', fid, 'trunk_extension | lombaires; rotation', '{Banc GHD}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Push-up incliné', fid, 'coordination | poussée; accessible', '{Banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Développé couché haltères', fid, 'upper_body_push | poussée; pectoraux; salle', '{Haltères+banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dips', fid, 'arms_triceps | poussée; triceps', '{Barres/banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Bench Press', fid, 'lower_body_strength | pectoraux; force_max', '{Barre+banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dumbbell Bench Press', fid, 'upper_body_push | pectoraux; haltères', '{Haltères+banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Floor Press', fid, 'upper_body_push | pectoraux; sol', '{Barre/haltères}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Explosive Band Push Ups', fid, 'upper_body_push | pectoraux; explosif; élastique', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Incline Bench Press', fid, 'upper_body_push | pectoraux_haut', '{Barre+banc incl}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Clapping Push Up', fid, 'upper_body_push | pectoraux; explosif; plyométrique', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lateral Plyo Push Up', fid, 'upper_body_push | pectoraux; plio; latéral', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Drop Push Ups', fid, 'upper_body_push | pectoraux; réactif; explosif', '{none}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hand Release Push Ups', fid, 'upper_body_push | pectoraux; qualité', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pull-up (traction prise large)', fid, 'coordination | dos; bodyweight', '{Barre traction}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Australian pull-up', fid, 'coordination | dos; accessible', '{Barre basse}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Tirage élastique', fid, 'coordination | dos; élastique; accessible', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Bent Over Row', fid, 'lower_body_strength | dos; force_max', '{Barre}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('DB Bent Over Row', fid, 'coordination | dos; haltères', '{Haltères}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Inverted Row', fid, 'coordination | dos; bodyweight', '{Barre basse}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Cable Row', fid, 'coordination | dos; câble; accessible', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Single Arm Cable Row', fid, 'coordination | dos; câble; unilat', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Band Rows', fid, 'coordination | dos; élastique', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pendlay Row', fid, 'lower_body_strength | dos; explosif; force_max', '{Barre}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lat Pulldowns', fid, 'coordination | dos; machine; accessible', '{Machine lat}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Band Lat Pulldowns', fid, 'coordination | dos; élastique', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Cardio' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Straight Arm Pulldowns', fid, 'conditioning | dos; grand_dorsal', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Mobilité' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('DB Pullovers', fid, 'mobility | dos; pullover; mobilité', '{Haltère+banc}', '{pull}', '{post_isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Tirage dos rotations élastique 1 bras', fid, 'coordination | dos; rotation; élastique', '{Élastique}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('trx tirage dos au sol', fid, 'coordination | dos; trx; sol', '{TRX}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Prévention' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Rotation externe élastique D', fid, 'prevention | épaule; rotateurs; prévention', '{Élastique}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Prone Y raise', fid, 'coordination | épaule; scapulaire; y', '{Haltères légers}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Prone T raise', fid, 'coordination | épaule; scapulaire; t', '{Haltères légers}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Développé militaire haltères', fid, 'lower_body_strength | épaule; force', '{Haltères}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Landmine press', fid, 'coordination | épaule; fonctionnel; gardien', '{Barre+coin}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Overhead Press', fid, 'lower_body_strength | épaule; force_max', '{Barre}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('DB Overhead Press', fid, 'coordination | épaule; haltères', '{Haltères}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Push Press', fid, 'coordination | épaule; push_press; explosif', '{Barre}', '{push}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Pike Push Up', fid, 'coordination | épaule; bodyweight', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Front Plate Raise', fid, 'coordination | épaule; antérieure', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Lateral Raise', fid, 'coordination | épaule; latérale', '{Haltères}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Rear Delt Raise', fid, 'coordination | épaule; postérieure', '{Haltères}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Coordination' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('ITYs', fid, 'coordination | épaule; scapulaire; i_t_y', '{Haltères/disques}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Triceps extension overhead', fid, 'arms_triceps | triceps', '{Haltère}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hammer curl', fid, 'arms_biceps | biceps; brachial', '{Haltères}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hammer Curls', fid, 'arms_biceps | biceps; brachial; grip', '{Haltères}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('DB Curls', fid, 'arms_biceps | biceps; classique', '{Haltères}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('EZ Bar Curls', fid, 'arms_biceps | biceps; ez_bar', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Hex Holds', fid, 'lower_body_strength | grip; iso; force_préhensile', '{Haltères hex}', '{sprint}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Rolling Tricep Extensions', fid, 'arms_triceps | triceps; rollout', '{Barre+banc}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Cable Tricep Extensions', fid, 'arms_triceps | triceps; câble', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Skull Crushers', fid, 'arms_triceps | triceps; isolation', '{Barre EZ+banc}', '{sprint}', '{isometric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Overhead DB Extension', fid, 'arms_triceps | triceps; overhead; long_chef', '{Haltère}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('TRX curls biceps', fid, 'arms_biceps | biceps; trx', '{TRX}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Battle rope triceps', fid, 'arms_triceps | triceps; battle_rope; explosif', '{none}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Soccer Toss', fid, 'upper_body_push | medball; soccer; football', '{Ballon médecine}', '{ball_skill}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Rebound Chest Pass', fid, 'plyometric_power | medball; rebond; pectoraux', '{Ballon médecine+mur}', '{jump}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Supine Chest Pass', fid, 'upper_body_push | medball; allongé', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Broad Toss', fid, 'upper_body_push | medball; horizontal', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Pliométrie' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Rebound Broad Toss', fid, 'plyometric_power | medball; rebond; horizontal', '{Ballon médecine+mur}', '{jump}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Half Kneeling Single Arm Broad Toss', fid, 'upper_body_push | medball; demi_genou; unilat', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Single Arm Broad Toss', fid, 'upper_body_push | medball; unilat; horizontal', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('MB Toss Starts Half Kneeling', fid, 'acceleration | medball; départ; accélération', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Accélération' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('MB Toss Starts 2 Point', fid, 'acceleration | medball; départ; 2_points', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dynamic Side Toss', fid, 'upper_body_push | medball; latéral; rotation', '{Ballon médecine}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Reactive Side Toss', fid, 'upper_body_push | medball; réactif; latéral', '{Ballon médecine}', '{sprint}', '{reactive}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Side Toss', fid, 'upper_body_push | medball; latéral; rotation', '{Ballon médecine}', '{rotation}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Side Slam', fid, 'upper_body_push | medball; slam; latéral', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Kneeling Side Slam', fid, 'upper_body_push | medball; genou; latéral', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dynamic Overhead Side Toss', fid, 'upper_body_push | medball; overhead; latéral', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Half Kneeling Side Toss', fid, 'upper_body_push | medball; demi_genou; latéral', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Split Stance Medball Side Toss', fid, 'lower_body_strength | medball; fente; latéral', '{Ballon médecine}', '{lunge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Med Ball Slam', fid, 'upper_body_push | medball; slam; vertical', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Backwards Toss', fid, 'upper_body_push | medball; arrière; chaîne_post', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Vertical Toss', fid, 'upper_body_push | medball; vertical; explosif', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Underhand Toss', fid, 'upper_body_push | medball; sous_main; hip_ext', '{Ballon médecine}', '{hinge}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Med Ball Half Kneeling Vertical Toss', fid, 'upper_body_push | medball; demi_genou; vertical', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sit Up Soccer Toss', fid, 'core_static | medball; sit_up; core', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Staggered Stance Vertical Toss', fid, 'upper_body_push | medball; décalé; vertical', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Dynamic Soccer Toss', fid, 'upper_body_push | medball; soccer; dynamique', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Kneeling Soccer Toss', fid, 'upper_body_push | medball; soccer; genou', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Seated Med Ball Toss', fid, 'upper_body_push | medball; assis; accessible', '{Ballon médecine}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Sprinter Step Up Med Ball Toss', fid, 'upper_body_push | medball; step_up; pap', '{Ballon médecine+box}', '{sprint}', '{concentric}', NULL);

  SELECT id INTO fid FROM familles WHERE nom = 'Force' LIMIT 1;
  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)
  VALUES ('Single Leg Push Off Broad Toss', fid, 'upper_body_push | medball; unilat; push_off', '{Ballon médecine}', '{push}', '{concentric}', NULL);

END $$;

SELECT COUNT(*) as total_exercices FROM exercices;