// ─── Base d'exercices & moteur de génération de séance ───────────────────────

export type ExItem = { n: string; d: string; c?: string }
export type EnvEx = { terrain: ExItem[]; salle: ExItem[]; maison: ExItem[] }

export type Poste = 'attaquant' | 'ailier' | 'milieu' | 'lateral' | 'defenseur' | 'gardien'
export type Objectif = 'vitesse' | 'force' | 'prevention' | 'endurance' | 'cod' | 'technique' | 'frappe' | 'detente'
export type ATR = 'ACC' | 'TRA' | 'REA' | 'DEC'
export type Env = 'terrain' | 'salle' | 'maison'
export type MD = 'MD+3' | 'MD+2' | 'MD-4' | 'MD-2' | 'MD-1' | 'MD'
export type Ressenti = 'Frais' | 'Normal' | 'Fatigué' | 'Très fatigué'
export type Douleur = 'Aucune' | 'Genou' | 'Ischios' | 'Cheville' | 'Adducteurs' | 'Dos'

export type PhaseSeance = {
  nom: string
  desc: string
  duree: string
  rpe: number
  exos: ExItem[]
}

export type SeanceGeneree = {
  titre: string
  meta: string
  phases: PhaseSeance[]
  msgFin: string
  msgAtr: string
}

// ─── Base d'exercices ─────────────────────────────────────────────────────────

export const EX: Record<string, EnvEx> = {
  eveil: {
    terrain: [
      { n: 'A-skip bilatéral', d: '2 tours · 20m · 30s entre', c: 'Active tes jambes comme avant un sprint' },
      { n: 'Griffé', d: '2 tours · 20m · 30s entre', c: 'Contact sol minimal — comme en match' },
      { n: 'Talons fesses', d: '2 tours · 20m · 30s entre', c: 'Réveille tes ischios avant l\'effort' },
      { n: 'Mobilité hanches dynamique', d: '2 tours · 10 actions chaque côté', c: 'Libère tes hanches pour les changements de direction' },
      { n: 'Band lateral walks', d: '2 tours · 15m chaque sens', c: 'Active tes fessiers — moteur du sprint' },
    ],
    salle: [
      { n: 'Vélo léger', d: '2 tours · 5 min à 60%', c: 'Monte en température progressivement' },
      { n: 'Mobilité hanches au sol', d: '2 tours · 10 actions chaque côté', c: 'Libère tes hanches avant l\'effort' },
      { n: 'Glute bridge march', d: '2 tours · 15 actions', c: 'Active ta chaîne postérieure' },
      { n: 'Dead bug inversé', d: '2 tours · 10 actions', c: 'Connecte ton gainage avant de charger' },
    ],
    maison: [
      { n: 'Skipping sur place', d: '3 tours · 20s · 20s entre', c: 'Réveille ton SNC — même effet qu\'un sprint' },
      { n: 'Mobilité hanches au sol', d: '2 tours · 10 actions chaque côté', c: 'Libère tes hanches' },
      { n: 'Glute bridge march', d: '2 tours · 15 actions', c: 'Active tes fessiers avant l\'effort' },
      { n: 'Dead bug', d: '2 tours · 10 actions', c: 'Stabilise ton tronc' },
    ],
  },
  technique: {
    terrain: [
      { n: 'B-skip bilatéral', d: '3 tours · 20m · 45s entre', c: 'Améliore ta mécanique de course' },
      { n: 'Foulées bondissantes', d: '3 tours · 20m · 45s entre', c: 'Projection horizontale — ton premier pas' },
      { n: 'Psoas élastique levées genoux', d: '3 tours · 10 actions · 45s entre', c: 'Le psoas fait le sprint — travaille-le' },
      { n: 'Build up sprint', d: '3 tours · 40m progressifs · 90s entre', c: 'Monte en vitesse progressivement' },
    ],
    salle: [
      { n: 'Foulées bondissantes', d: '3 tours · 20m · 45s entre', c: 'Projection horizontale — ton premier pas' },
      { n: 'Stepping sur tapis roulant', d: '3 tours · 3 min · 1 min entre', c: 'Mécanique de course — technique pure' },
      { n: 'Psoas levées genoux élastique', d: '3 tours · 10 actions · 45s entre', c: 'Le moteur de ton sprint' },
    ],
    maison: [
      { n: 'Skipping rapide sur place', d: '4 tours · 15s · 30s entre', c: 'Fréquence d\'appui — même que sur le terrain' },
      { n: 'Percutions serrées', d: '3 tours · 20s · 30s entre', c: 'Appuis rapides — réactivité de match' },
      { n: 'Psoas levées genoux élastique', d: '3 tours · 10 actions · 45s entre', c: 'Active le moteur du sprint' },
    ],
  },
  vitesse: {
    terrain: [
      { n: 'Départ arrêté 10m', d: '6 tours · 10m · 2 min entre', c: 'Ton premier pas fait la différence sur ce poste' },
      { n: 'Falling start 15m', d: '5 tours · 15m · 2 min entre', c: 'Chute vers l\'avant — projection maximale' },
      { n: 'Flying sprint 30m', d: '4 tours · 30m · 3 min entre', c: 'Exprime ta vitesse maximale' },
      { n: 'Sprint réactif sur signal', d: '5 tours · 10m · 90s entre', c: 'Comme en match — réaction + vitesse' },
    ],
    salle: [
      { n: 'Sprint tapis de course 6s', d: '6 tours · 6s à 100% · 2 min entre', c: 'Vitesse maximale sur machine' },
      { n: 'Squat jump explosif', d: '4 tours · 5 actions · 2 min entre', c: 'Puissance de jambe — transfert sprint' },
      { n: 'Départ arrêté couloir', d: '5 tours · 10m · 2 min entre', c: 'Premier pas explosif' },
    ],
    maison: [
      { n: 'Skipping maximal 10s', d: '6 tours · 10s à fond · 90s entre', c: 'Stimulus neural — équivalent sprint court' },
      { n: 'Squat jump', d: '4 tours · 5 actions · 2 min entre', c: 'Puissance de jambe — transfert direct' },
      { n: 'Percutions serrées explosives', d: '5 tours · 10s max · 90s entre', c: 'Réactivité et fréquence d\'appui' },
    ],
  },
  force: {
    terrain: [
      { n: 'Fentes stationnaires profondes', d: '3 tours · 10 actions chaque jambe · 90s entre', c: 'Force de poussée — ton duel physique' },
      { n: 'RDL 1 jambe poids du corps', d: '3 tours · 8 actions chaque jambe · 90s entre', c: 'Protège tes ischios — indispensable' },
      { n: 'Nordic élastique', d: '3 tours · 6 actions · 2 min entre', c: 'Tes ischios à la vitesse du sprint' },
      { n: 'Squat poids du corps', d: '3 tours · 12 actions · 60s entre', c: 'Base de toute ta puissance' },
    ],
    salle: [
      { n: 'Back squat', d: '4 tours · 6 actions · 2 min entre', c: 'Ta puissance de base — tout passe par là' },
      { n: 'RDL haltères', d: '4 tours · 8 actions · 2 min entre', c: 'Chaîne postérieure — protection ischios' },
      { n: 'Bulgarian split squat', d: '3 tours · 8 actions chaque jambe · 90s entre', c: 'Force unilatérale — comme en match' },
      { n: 'Hip thrust chargé', d: '3 tours · 8 actions · 90s entre', c: 'Moteur de la hanche — frappe et sprint' },
    ],
    maison: [
      { n: 'Fentes stationnaires lentes (3-1-2)', d: '3 tours · 10 actions chaque jambe · 90s entre', c: 'Force profonde — tempo compense la charge' },
      { n: 'RDL 1 jambe poids du corps', d: '3 tours · 10 actions chaque jambe · 90s entre', c: 'Ischios protégés' },
      { n: 'Chaise isométrique 40s', d: '3 tours · 40s · 90s entre', c: 'Force à l\'angle exact de ton saut' },
      { n: 'Single leg bridge dynamique', d: '3 tours · 12 actions · 60s entre', c: 'Fessiers et ischios — moteur du sprint' },
    ],
  },
  prevention: {
    terrain: [
      { n: 'Nordic hamstring élastique', d: '3 tours · 6 actions · 2 min entre', c: 'Protège tes ischios là où ils se blessent' },
      { n: 'Copenhagen plank', d: '3 tours · 20s chaque côté · 90s entre', c: 'Adducteurs solides — moins de pubalgie' },
      { n: 'Proprioception horloge 1 jambe', d: '2 tours · 30s chaque jambe · 45s entre', c: 'Cheville stable — moins d\'entorses' },
      { n: 'Tibialis raises', d: '3 tours · 15 actions · 45s entre', c: 'Protège tes genoux et tes chevilles' },
    ],
    salle: [
      { n: 'Nordic hamstring machine', d: '3 tours · 6 actions · 2 min entre', c: 'Ischios solides à haute vitesse' },
      { n: 'Copenhagen plank TRX', d: '3 tours · 20s chaque côté · 90s entre', c: 'Adducteurs — prévention pubalgie' },
      { n: 'Proprioception BOSU', d: '2 tours · 30s chaque jambe · 45s entre', c: 'Stabilité de cheville — indispensable' },
      { n: 'Adducteurs câble', d: '3 tours · 12 actions · 60s entre', c: 'Protège l\'aine' },
    ],
    maison: [
      { n: 'Nordic avec élastique (aide)', d: '3 tours · 6 actions · 2 min entre', c: 'Tes ischios là où ils se blessent en sprint' },
      { n: 'Fente latérale + stabilité', d: '3 tours · 10 actions chaque côté · 60s entre', c: 'Adducteurs solides' },
      { n: 'Proprioception horloge 1 jambe', d: '2 tours · 30s chaque jambe · 45s entre', c: 'Cheville stable' },
      { n: 'RDL 1 jambe poids du corps', d: '3 tours · 10 actions chaque jambe · 90s entre', c: 'Ischios protégés en position de sprint' },
    ],
  },
  cod: {
    terrain: [
      { n: 'Pro shuttle 5-10-5', d: '5 tours · 100% · 90s entre', c: 'Changements de direction comme en match' },
      { n: 'Stop and go 5m', d: '6 tours · 90% · 60s entre', c: 'Freinage + relance — ta vivacité' },
      { n: 'Appuis latéraux plots', d: '4 tours · 10s · 60s entre', c: 'Déplacements défensifs — rapide et précis' },
      { n: 'Sprint réactif sur signal COD', d: '5 tours · 10m · 90s entre', c: 'Décision + action — comme un vrai duel' },
    ],
    salle: [
      { n: 'Ladder drill vitesse', d: '4 tours · 10m · 45s entre', c: 'Fréquence d\'appui et coordination' },
      { n: 'Appuis latéraux tapis', d: '4 tours · 10s · 60s entre', c: 'Vivacité latérale' },
      { n: 'Stop and go couloir', d: '5 tours · 90% · 60s entre', c: 'Freinage + relance — ta vivacité' },
    ],
    maison: [
      { n: 'Appuis A/R sur ligne', d: '5 tours · 10s · 45s entre', c: 'Vivacité — appuis rapides sans terrain' },
      { n: 'Percutions écartées-serrées', d: '4 tours · 15s · 45s entre', c: 'Fréquence et coordination d\'appui' },
      { n: 'Side jumps', d: '4 tours · 10 actions · 60s entre', c: 'Réactivité latérale' },
    ],
  },
  endurance: {
    terrain: [
      { n: 'Intermittent 15-15 à 90% VMA', d: '2 séries · 8 actions · 3 min entre séries', c: 'Résistance match — tiens en 2e mi-temps' },
      { n: 'Fartlek terrain 20 min', d: '1 tour · variations allure libre', c: 'Endurance de match — course intelligente' },
      { n: 'RSA navettes 20m', d: '3 séries · 5 navettes · 4 min entre', c: 'Répète tes sprints comme en match' },
    ],
    salle: [
      { n: 'Vélo intermittent 20s/10s', d: '3 séries · 8 actions · 3 min entre', c: 'Puissance aérobie — tiens sur 90 min' },
      { n: 'Rameur 500m répété', d: '4 actions · 500m · 2 min entre', c: 'Endurance cardiovasculaire — pas de jambes' },
    ],
    maison: [
      { n: 'HIIT squat + course sur place', d: '4 tours · 30s effort/30s repos · 3 min entre séries', c: 'Cardio de match sans terrain' },
      { n: 'Corde à sauter rapide', d: '5 tours · 1 min · 1 min entre', c: 'Endurance et réactivité combinées' },
      { n: 'Burpees modifiés', d: '3 séries · 10 actions · 2 min entre', c: 'Efforts répétés — comme un pressing' },
    ],
  },
  frappe: {
    terrain: [
      { n: 'Demi-squat explosif stato-dynamique', d: '4 tours · 6 actions · 2 min entre', c: 'Puissance de jambe à l\'angle exact de ta frappe' },
      { n: 'Frappe élastique adducteurs', d: '3 tours · 10 actions chaque jambe · 90s entre', c: 'Le muscle qui donne la puissance à ton tir' },
      { n: 'Fente avant + frappe de balle', d: '3 tours · 8 actions · 90s entre', c: 'Enchaîne la force et le geste de tir' },
      { n: 'Anti-rotation élastique', d: '3 tours · 12 actions chaque côté · 60s entre', c: 'Gainage du torse — précision de frappe' },
    ],
    salle: [
      { n: 'Leg press partiel explosif (90-120°)', d: '4 tours · 6 actions · 2 min entre', c: 'Angle exact de ta frappe — force ciblée' },
      { n: 'Hip thrust + rotation', d: '3 tours · 8 actions · 90s entre', c: 'Chaîne hanche vers frappe' },
      { n: 'Cable anti-rotation', d: '3 tours · 12 actions · 60s entre', c: 'Torse stable = frappe précise' },
    ],
    maison: [
      { n: 'Demi-squat explosif PDC', d: '4 tours · 8 actions · 90s entre', c: 'Puissance de jambe à l\'angle de frappe' },
      { n: 'Frappe élastique adducteurs', d: '3 tours · 10 actions chaque jambe · 90s entre', c: 'Muscle principal de ta frappe' },
      { n: 'Rotation obliques élastique', d: '3 tours · 12 actions chaque côté · 60s entre', c: 'Gainage rotatif — puissance de tir' },
    ],
  },
  detente: {
    terrain: [
      { n: 'Squat jump stato-dynamique (pause 3s)', d: '4 tours · 5 actions · 2 min entre', c: 'Force à 110° genou — ton angle de détente' },
      { n: 'Drop jump réactif', d: '4 tours · 5 actions · 2 min entre', c: 'SSC pur — rebond élastique maximum' },
      { n: 'Détentes 1 jambe alternées', d: '3 tours · 6 actions · 2 min entre', c: 'Puissance unilatérale — jeu de tête en duel' },
      { n: 'Broad jump', d: '4 tours · 5 actions · 2 min entre', c: 'Projection horizontale + verticale combinée' },
    ],
    salle: [
      { n: 'Box jump 40cm', d: '4 tours · 5 actions · 2 min entre', c: 'Puissance verticale — ton saut de jeu de tête' },
      { n: 'Drop jump depuis box', d: '4 tours · 5 actions · 2 min entre', c: 'SSC — rebond le plus efficace' },
      { n: 'Squat pause + explosion', d: '4 tours · 5 actions · 2 min entre', c: 'Force à l\'angle exact du saut' },
    ],
    maison: [
      { n: 'Squat jump PDC', d: '4 tours · 6 actions · 2 min entre', c: 'Puissance verticale — ton saut' },
      { n: 'Pogo jumps', d: '3 tours · 10 contacts · 2 min entre', c: 'Stiffness — raideur élastique de la cheville' },
      { n: 'Fentes sautées alternées', d: '3 tours · 6 actions chaque jambe · 90s entre', c: 'Puissance unilatérale de saut' },
    ],
  },
  core: {
    terrain: [
      { n: 'Planche latérale 30s', d: '3 tours · 30s chaque côté · 45s entre', c: 'Tronc stable — tiens dans les duels' },
      { n: 'Dead bug', d: '3 tours · 10 actions · 45s entre', c: 'Connexion tronc-jambes — base de tout' },
      { n: 'Anti-rotation élastique', d: '3 tours · 10 actions chaque côté · 45s entre', c: 'Gainage fonctionnel — geste de match' },
    ],
    salle: [
      { n: 'Pallof press', d: '3 tours · 10 actions chaque côté · 45s entre', c: 'Anti-rotation pure — le vrai gainage' },
      { n: 'Planche 40s', d: '3 tours · 40s · 45s entre', c: 'Endurance de gainage' },
      { n: 'Jacknife TRX', d: '3 tours · 8 actions · 60s entre', c: 'Core dynamique — transfert frappe' },
    ],
    maison: [
      { n: 'Planche 40s', d: '3 tours · 40s · 45s entre', c: 'Base du gainage — stable sous fatigue' },
      { n: 'Dead bug', d: '3 tours · 10 actions · 45s entre', c: 'Connexion tronc — protection lombaire' },
      { n: 'Rotation élastique', d: '3 tours · 10 actions chaque côté · 45s entre', c: 'Gainage rotatif — frappe et passes' },
    ],
  },
}

// ─── Exercices de transfert par poste ─────────────────────────────────────────

export const TRANSFER: Record<Poste, EnvEx> = {
  attaquant: {
    terrain: [
      { n: 'Conduite + sprint + finition', d: '4 tours · 15m · 2 min entre', c: 'Accélère et finis — ton geste de match' },
      { n: 'Contrôle orienté + frappe', d: '4 tours · 5 actions · 90s entre', c: 'Premier contrôle — frappe directe' },
    ],
    salle: [
      { n: 'Frappe élastique + explosivité', d: '4 tours · 8 actions · 90s entre', c: 'Puissance de frappe — ta finition' },
      { n: 'Squat jump + frappe imaginaire', d: '3 tours · 6 actions · 90s entre', c: 'Détente + finition — enchaîne' },
    ],
    maison: [
      { n: 'Frappe élastique pied droit et gauche', d: '3 tours · 10 actions chaque pied · 90s entre', c: 'Les deux pieds — l\'attaquant complet' },
      { n: 'Demi-squat explosif + simulation tir', d: '4 tours · 6 actions · 90s entre', c: 'Puissance de jambe vers la finition' },
    ],
  },
  ailier: {
    terrain: [
      { n: 'Sprint courbe + centre', d: '4 tours · 30m courbe · 2 min entre', c: 'Ta course en couloir — centre précis' },
      { n: 'Accélération + dribble + sprint', d: '4 tours · 20m · 90s entre', c: 'Élimine et accélère — ton geste signature' },
    ],
    salle: [
      { n: 'Frappe croisée élastique', d: '4 tours · 8 actions · 90s entre', c: 'Centre ou tir croisé — ta spécialité' },
      { n: 'Step latéral explosif', d: '4 tours · 5m explosifs · 90s entre', c: 'Elimination du défenseur — premier pas décisif' },
    ],
    maison: [
      { n: 'Accélération + élimination simulée', d: '4 tours · 10m · 90s entre', c: 'Dribble + vitesse — ton arme principale' },
      { n: 'Frappe élastique en mouvement', d: '3 tours · 10 actions · 90s entre', c: 'Centrer ou tirer en course' },
    ],
  },
  milieu: {
    terrain: [
      { n: 'Passe courte + déplacement + réception', d: '4 tours · circuit 20m · 90s entre', c: 'Joue, déplace-toi, rejoue — comme un vrai 8' },
      { n: 'Sprint de couverture + récupération balle', d: '4 tours · 30m · 2 min entre', c: 'Pressing et contre-pressing — ton moteur' },
    ],
    salle: [
      { n: 'Cardio + précision frappe', d: '4 tours · 5 min + frappes · 2 min entre', c: 'Tiens physiquement et reste précis' },
      { n: 'Explosivité + passe courte simulée', d: '4 tours · 8 actions · 90s entre', c: 'Sprint + passe — ta répétition de match' },
    ],
    maison: [
      { n: 'HIIT + coordination balle', d: '3 tours · 30s effort · 30s technique ballon', c: 'Conditioning + technique — milieu complet' },
      { n: 'Jonglage bimane en fatigue', d: '3 tours · 2 min · 1 min entre', c: 'Technique sous fatigue — match réel' },
    ],
  },
  lateral: {
    terrain: [
      { n: 'Sprint couloir + centre + sprint retour', d: '4 tours · 50m aller-retour · 2 min entre', c: 'Ta course de latéral — aller-retour explosif' },
      { n: 'Accélération latérale + centrage', d: '4 tours · 20m + centre · 90s entre', c: 'Couloir + centre — ton action de match' },
    ],
    salle: [
      { n: 'Step latéral explosif + sprint', d: '4 tours · 5+15m · 90s entre', c: 'Latéral — couloir — sprint — enchaîne' },
      { n: 'Endurance + accélération', d: '3 séries · 5 min allure + 3 sprints', c: 'Tiens 90 min et reste explosif' },
    ],
    maison: [
      { n: 'Appuis latéraux + sprint simulé', d: '4 tours · 10s latéral + 5s sprint · 90s entre', c: 'Mouvement de latéral — sans terrain' },
      { n: 'Cardio + explosivité jambes', d: '3 séries · 3 min + 5 sauts · 2 min entre', c: 'Endurance et vitesse — ton profil physique' },
    ],
  },
  defenseur: {
    terrain: [
      { n: 'Jeu de tête en mouvement', d: '4 tours · 5 têtes · 2 min entre', c: 'Domines les airs — ton duel aérien' },
      { n: 'Sprint retour défensif + duel', d: '4 tours · 20m + contact · 90s entre', c: 'Reviens et gagne le duel — ton boulot' },
    ],
    salle: [
      { n: 'Force + jeu de tête simulé', d: '3 tours · squat + détente + tête', c: 'Force de défenseur — saut dominant' },
      { n: 'Explosivité + duel physique', d: '3 tours · sprint + contact simulé', c: 'Puissance de défenseur central' },
    ],
    maison: [
      { n: 'Détente + coordination tête', d: '4 tours · 5 sauts + réception tête', c: 'Jeu aérien — domines tes duels' },
      { n: 'Force unipodal + stabilité', d: '3 tours · fente chaque jambe + équilibre', c: 'Stabilité pour les duels physiques' },
    ],
  },
  gardien: {
    terrain: [
      { n: 'Plongeon + relance rapide', d: '4 tours · 5 plongeons · 2 min entre', c: 'Intervention + relance — ton enchaînement de gardien' },
      { n: 'Sprint couloir + retour en but', d: '4 tours · 20m · 2 min entre', c: 'Sortie + replacement — ta mobilité de but' },
    ],
    salle: [
      { n: 'Explosivité latérale + réaction', d: '4 tours · 5 sauts latéraux · 90s entre', c: 'Détente latérale — tes arrêts en dehors' },
      { n: 'Proprioception + force épaule', d: '3 tours · circuit épaule + équilibre', c: 'Épaule protégée — tes appuis de gardien' },
    ],
    maison: [
      { n: 'Sauts latéraux + réception', d: '4 tours · 5 sauts · 90s entre', c: 'Tes plongeons — explosivité latérale' },
      { n: 'Renfo épaule élastique', d: '3 tours · 12 actions · 60s entre', c: 'Épaule solide — protection de gardien' },
    ],
  },
}

// ─── Config volume par phase ATR ──────────────────────────────────────────────

export const VOL: Record<ATR, { sets_main: number; sets_min: number; msg_atr: string }> = {
  ACC: { sets_main: 4, sets_min: 3, msg_atr: 'On construit ta base cette semaine.' },
  TRA: { sets_main: 3, sets_min: 3, msg_atr: 'On convertit ta force en puissance.' },
  REA: { sets_main: 3, sets_min: 2, msg_atr: 'Cette semaine tu exprimes tout ce qu\'on a construit.' },
  DEC: { sets_main: 2, sets_min: 2, msg_atr: 'Volume réduit — ton corps assimile et se souvient.' },
}

// ─── Messages de fin par objectif et poste ────────────────────────────────────

export const MSGS: Partial<Record<Objectif, Record<Poste, string>>> = {
  vitesse: {
    attaquant: 'T\'as travaillé ton premier pas aujourd\'hui. En match, c\'est ça qui crée l\'écart sur le défenseur.',
    ailier: 'Ta vitesse en couloir devient une arme. Continue cette semaine.',
    milieu: 'Les 3 mètres gagnés en vitesse, c\'est un pressing réussi ou un duel gagné.',
    lateral: 'Aller-retour explosif — c\'est ça le niveau du latéral moderne.',
    defenseur: 'Vitesse de replacement — tu seras là quand ça compte vraiment.',
    gardien: 'Tes déplacements dans le but deviennent plus explosifs. Ça se voit en match.',
  },
  force: {
    attaquant: 'Tes jambes sont plus solides. En duel, tu tiendras le ballon mieux.',
    ailier: 'Force de jambe — tu ressortiras plus vite de l\'élimination.',
    milieu: 'Les duels physiques au milieu se gagnent avec ça. T\'as fait le boulot.',
    lateral: 'Force unilatérale — tes courses en couloir seront plus puissantes.',
    defenseur: 'Tes duels physiques vont changer. Cette force-là se ressent sur le terrain.',
    gardien: 'Force de jambes — tes sorties et tes plongeons seront plus explosifs.',
  },
  prevention: {
    attaquant: 'Tes ischios sont protégés là où ils se blessent pendant un sprint. Indispensable.',
    ailier: 'Ischios et adducteurs solides — tu continues à sprinter sans risque.',
    milieu: 'Prévention faite. Ton corps peut encaisser les charges de la semaine.',
    lateral: 'Ischios et cheville — les deux zones les plus à risque sur ton poste. C\'est fait.',
    defenseur: 'Tes genoux et tes ischios sont protégés. Joue sans crainte.',
    gardien: 'Épaule et genou protégés — tu peux te jeter sans peur.',
  },
  endurance: {
    attaquant: 'Tu tiendras en 2e mi-temps quand les autres lâchent. C\'est là que tu marques.',
    ailier: 'Tes sprints en fin de match seront encore explosifs. C\'est ça la différence.',
    milieu: '90 minutes à ton niveau d\'intensité — c\'est ça qui se construit aujourd\'hui.',
    lateral: 'Aller-retour sur 90 min — tu viens de travailler exactement ça.',
    defenseur: 'Concentration et intensité sur 90 min — tu gardes la tête froide jusqu\'au bout.',
    gardien: 'Présence et explosivité sur 90 min — gardien complet.',
  },
  cod: {
    attaquant: 'Tes changements de direction après la reception ballon vont gagner en efficacité.',
    ailier: 'Elimination + réaccélération — ton arme principale vient de progresser.',
    milieu: 'Vivacité dans les petits espaces — c\'est ça qui crée la différence au milieu.',
    lateral: 'Tes appuis latéraux défensifs et offensifs progressent. Tu verras en match.',
    defenseur: 'Tes retournements défensifs sont plus rapides. Les attaquants vont souffrir.',
    gardien: 'Tes déplacements dans le but et tes sorties sont plus vifs.',
  },
  technique: {
    attaquant: 'Mécanique de course améliorée — tes sprints vers le but seront plus efficaces.',
    ailier: 'Course en couloir plus efficiente — moins de dépense pour plus de vitesse.',
    milieu: 'Mécanique et fréquence — tu couvriras plus d\'espace pour le même effort.',
    lateral: 'Course en couloir plus propre — tu seras encore plus dangereux sur les flancs.',
    defenseur: 'Replacement et vitesse de course — ta mécanique protège tes ischios.',
    gardien: 'Tes sorties de but sont plus propres mécaniquement. Moins de risque de blessure.',
  },
  frappe: {
    attaquant: 'Ta frappe est plus puissante à l\'angle exact où tu tires en match. T\'as fait le bon travail.',
    ailier: 'Centre ou tir — la puissance vient de tes adducteurs. Tu viens de les renforcer.',
    milieu: 'Tes frappes de loin vont gagner en puissance. Le travail d\'aujourd\'hui va payer.',
    lateral: 'Tes centres vont avoir plus de puissance et de précision. Tu verras samedi.',
    defenseur: 'Tes dégagements et tes relances seront plus puissants. T\'as travaillé les bons muscles.',
    gardien: 'Tes relances aux pieds sont plus puissantes. Gardien moderne.',
  },
  detente: {
    attaquant: 'Ta détente progresse à l\'angle exact du saut de jeu de tête. Continue.',
    ailier: 'Tu sautes plus haut pour les centres fuyants. Ça se verra en match.',
    milieu: 'Jeu de tête au milieu — tu gagnes ces duels aériens maintenant.',
    lateral: 'Tes montées offensives avec tête vont être plus efficaces.',
    defenseur: 'Jeu aérien dominant — tes duels aériens vont pencher de ton côté.',
    gardien: 'Tes sorties aériennes sont plus explosives. Tu domines ta surface.',
  },
}

// ─── Titres par objectif et poste ─────────────────────────────────────────────

export const TITRES: Partial<Record<Objectif, Record<Poste, string>>> = {
  vitesse: {
    attaquant: 'Aujourd\'hui tu gagnes le sprint sur le défenseur',
    ailier: 'Aujourd\'hui tu élimines plus vite dans le couloir',
    milieu: 'Aujourd\'hui tu couvres plus de terrain plus vite',
    lateral: 'Aujourd\'hui tu exploites mieux tes couloirs',
    defenseur: 'Aujourd\'hui tu te places plus vite',
    gardien: 'Aujourd\'hui tu te déplaces plus vite dans le but',
  },
  force: {
    attaquant: 'Aujourd\'hui tu tiens le ballon sous pression',
    ailier: 'Aujourd\'hui tu ressors plus fort après le contact',
    milieu: 'Aujourd\'hui tu gagnes les duels physiques',
    lateral: 'Aujourd\'hui tu pousses plus fort dans les couloirs',
    defenseur: 'Aujourd\'hui tu domines physiquement',
    gardien: 'Aujourd\'hui tes jambes deviennent des ressorts',
  },
  prevention: {
    attaquant: 'Aujourd\'hui tu protèges tes muscles de sprint',
    ailier: 'Aujourd\'hui tu sécurises ta machine de course',
    milieu: 'Aujourd\'hui tu prépares ton corps aux charges',
    lateral: 'Aujourd\'hui tu protèges tes zones à risque',
    defenseur: 'Aujourd\'hui tu gardes tes muscles sains',
    gardien: 'Aujourd\'hui tu sécurises tes zones fragiles',
  },
  endurance: {
    attaquant: 'Aujourd\'hui tu tiens en 2e mi-temps',
    ailier: 'Aujourd\'hui tu gardes ton explosivité jusqu\'au bout',
    milieu: 'Aujourd\'hui tu joues 90 minutes à fond',
    lateral: 'Aujourd\'hui tu fais les aller-retours jusqu\'au bout',
    defenseur: 'Aujourd\'hui tu restes concentré sur 90 minutes',
    gardien: 'Aujourd\'hui tu maintiens ta présence sur 90 min',
  },
  cod: {
    attaquant: 'Aujourd\'hui tu élimines plus facilement',
    ailier: 'Aujourd\'hui ton élimination devient une arme',
    milieu: 'Aujourd\'hui tu es plus vif dans les petits espaces',
    lateral: 'Aujourd\'hui tes appuis latéraux s\'affûtent',
    defenseur: 'Aujourd\'hui tes retournements défensifs progressent',
    gardien: 'Aujourd\'hui tes déplacements dans le but s\'améliorent',
  },
  technique: {
    attaquant: 'Aujourd\'hui ta course vers le but est plus efficace',
    ailier: 'Aujourd\'hui ta course en couloir progresse',
    milieu: 'Aujourd\'hui tu couvres plus pour moins d\'effort',
    lateral: 'Aujourd\'hui ta montée de couloir est plus propre',
    defenseur: 'Aujourd\'hui ta mécanique de replacement s\'améliore',
    gardien: 'Aujourd\'hui tes sorties sont plus propres',
  },
  frappe: {
    attaquant: 'Aujourd\'hui ta finition gagne en puissance',
    ailier: 'Aujourd\'hui tes centres et frappes progressent',
    milieu: 'Aujourd\'hui tes frappes de loin deviennent une arme',
    lateral: 'Aujourd\'hui tes centres gagnent en puissance',
    defenseur: 'Aujourd\'hui tes dégagements deviennent des armes',
    gardien: 'Aujourd\'hui tes relances aux pieds s\'améliorent',
  },
  detente: {
    attaquant: 'Aujourd\'hui ton saut gagne en hauteur',
    ailier: 'Aujourd\'hui ta détente sur centre progresse',
    milieu: 'Aujourd\'hui tu gagnes les duels aériens au milieu',
    lateral: 'Aujourd\'hui tes montées avec tête s\'améliorent',
    defenseur: 'Aujourd\'hui tu domines les airs',
    gardien: 'Aujourd\'hui tes sorties aériennes sont plus explosives',
  },
}

// ─── Moteur de génération ─────────────────────────────────────────────────────

function pick(arr: ExItem[], n: number): ExItem[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length))
}

export type GenParams = {
  poste: Poste
  niv: string
  md: MD
  obj: Objectif
  atr: ATR
  env: Env
  tps: number
  sem: number
  ressenti: Ressenti
  douleur: Douleur
  demande?: string
}

export function genererSeance(p: GenParams): SeanceGeneree {
  const fat = p.ressenti === 'Fatigué' || p.ressenti === 'Très fatigué'
  const volCfg = VOL[p.atr]
  const envKey = p.env

  // Durées par phase selon temps total
  let durPhases: number[]
  if (p.tps <= 20) durPhases = [5, 0, 10, 0, 5]
  else if (p.tps <= 45) durPhases = [8, 7, 15, 8, 7]
  else durPhases = [10, 10, 20, 10, 10]

  // Exercices de l'objectif
  const objEx = EX[p.obj] || EX.vitesse
  let mainEx = objEx[envKey] || objEx.terrain || []

  // Filtrage douleur
  if (p.douleur === 'Genou') mainEx = mainEx.filter(e => !e.n.toLowerCase().includes('squat') && !e.n.toLowerCase().includes('drop'))
  if (p.douleur === 'Ischios') mainEx = mainEx.filter(e => !e.n.toLowerCase().includes('nordic') && !e.n.toLowerCase().includes('rdl'))
  if (mainEx.length === 0) mainEx = objEx[envKey] || objEx.terrain || []

  // Restrictions selon jour match
  const mdRestrictions: Record<string, Objectif[]> = {
    'MD-1': ['vitesse', 'force', 'endurance', 'detente', 'frappe'],
    'MD':   ['vitesse', 'force', 'endurance', 'cod', 'detente', 'frappe'],
  }
  const restricted = mdRestrictions[p.md] || []
  const objFinal: Objectif = restricted.includes(p.obj) ? 'prevention' : p.obj
  if (objFinal !== p.obj) mainEx = EX.prevention[envKey] || EX.prevention.terrain

  // Prévention
  let prevEx = EX.prevention[envKey] || EX.prevention.terrain
  if (p.douleur === 'Genou') prevEx = prevEx.filter(e => !e.n.includes('squat'))
  if (p.douleur === 'Ischios') prevEx = prevEx.filter(e => !e.n.includes('Nordic'))

  const eveilEx    = EX.eveil[envKey]    || EX.eveil.terrain
  const techEx     = EX.technique[envKey] || EX.technique.terrain
  const coreEx     = EX.core[envKey]     || EX.core.terrain
  const transferEx = (TRANSFER[p.poste] || TRANSFER.milieu)[envKey] || (TRANSFER[p.poste] || TRANSFER.milieu).terrain

  const phases: PhaseSeance[] = []

  // 1 — Préparation neuromusculaire
  if (p.tps > 20) {
    phases.push({
      nom: 'Préparation neuromusculaire',
      desc: 'Mobilisation articulaire, activation musculaire, éveil du SNC',
      duree: durPhases[0] + 'min',
      rpe: fat ? 3 : 4,
      exos: pick(eveilEx, 3),
    })
  }

  // 2 — Activation spécifique
  if (p.tps > 20 && durPhases[1] > 0) {
    const items = (objFinal === 'vitesse' || objFinal === 'cod') ? pick(techEx, 2) : pick(coreEx, 2)
    phases.push({
      nom: 'Activation spécifique',
      desc: objFinal === 'vitesse' || objFinal === 'cod'
        ? 'Mécanique de course et fréquence d\'appui — tu prépares le moteur'
        : 'Gainage et stabilité — tu sécurises la base avant de charger',
      duree: durPhases[1] + 'min',
      rpe: fat ? 5 : 6,
      exos: items,
    })
  }

  // 3 — Renforcement spécifique
  const nomsObj: Record<Objectif, string> = {
    vitesse:    'Travail de vitesse maximale et explosivité — l\'objectif du jour',
    force:      'Renforcement bas du corps — construction de la puissance',
    prevention: 'Renforcement préventif — protection des zones à risque',
    endurance:  'Conditioning — endurance spécifique match',
    cod:        'Changements de direction et vivacité — ton arme',
    technique:  'Mécanique de course — efficience et économie d\'effort',
    frappe:     'Puissance de frappe — adducteurs, hanche, gainage rotatif',
    detente:    'Pliométrie verticale — ton saut de jeu de tête',
  }
  phases.push({
    nom: 'Renforcement spécifique',
    desc: nomsObj[objFinal],
    duree: durPhases[2] + 'min',
    rpe: fat ? 7 : (p.atr === 'REA' ? 9 : p.atr === 'TRA' ? 8 : 7),
    exos: pick(mainEx, fat ? 3 : 4),
  })

  // 4 — Transfert football
  if (p.tps > 20 && durPhases[3] > 0) {
    let transferItems = pick(transferEx, 2)
    if (p.demande) {
      const dl = p.demande.toLowerCase()
      const extras: ExItem[] = []
      if (dl.includes('accélér') || dl.includes('dribble'))
        extras.push({ n: 'Accélération sur dribble + sprint', d: '4 tours · 15m · 90s entre', c: 'Élimine et accélère — ton geste signature' })
      if (dl.includes('centre') || dl.includes('centrer'))
        extras.push({ n: 'Course + centre en puissance', d: '4 tours · 20m + centre · 90s entre', c: 'Ta course de couloir + ton centre — travaillés ensemble' })
      if (dl.includes('frappe') || dl.includes('tir'))
        extras.push({ n: 'Frappe en mouvement (pied droit + gauche)', d: '3 tours · 6 frappes · 90s entre', c: 'Frappe en course — comme en match' })
      if (extras.length > 0) transferItems = [...extras, ...transferItems].slice(0, 2)
    }
    phases.push({
      nom: 'Transfert football',
      desc: 'Le travail physique ancré dans le geste spécifique au poste',
      duree: durPhases[3] + 'min',
      rpe: fat ? 6 : 7,
      exos: transferItems,
    })
  }

  // 5 — Protection & récupération
  phases.push({
    nom: 'Protection & récupération',
    desc: 'Ischios excentriques, mobilité, stabilité — indispensable après l\'effort',
    duree: durPhases[4] + 'min',
    rpe: 3,
    exos: pick(prevEx, p.tps <= 20 ? 2 : 3),
  })

  const titre = (TITRES[objFinal] || TITRES.vitesse)![p.poste] || 'Aujourd\'hui tu progresses sur le terrain'
  const meta = `${p.md} · ${p.atr} S${p.sem}/8 · ${p.env} · ${p.tps} min · ${p.ressenti}${p.douleur !== 'Aucune' ? ' · Protège ' + p.douleur : ''}`
  const msgFin = MSGS[objFinal]?.[p.poste] || 'T\'as fait le boulot aujourd\'hui. Ça va payer sur le terrain.'
  const msgAtr = fat ? 'Tu es fatigué — j\'ai adapté. Ce que tu fais là, beaucoup ne le feraient pas.' : volCfg.msg_atr

  return { titre, meta, phases, msgFin, msgAtr }
}

export function seanceToText(s: SeanceGeneree): string {
  let txt = `PAGA COACHING — ${s.titre}\n${s.meta}\n${'—'.repeat(44)}\n\n`
  s.phases.forEach((p, i) => {
    txt += `[${i + 1}] ${p.nom.toUpperCase()} — ${p.duree}\n`
    p.exos.forEach(ex => {
      txt += `  • ${ex.n} — ${ex.d}\n`
      if (ex.c) txt += `    ➤ "${ex.c}"\n`
    })
    txt += '\n'
  })
  txt += '—'.repeat(44) + '\n' + s.msgFin
  return txt
}
