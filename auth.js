const argon2 = require("argon2");
const jwt = require("jsonwebtoken");


const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};



const hashPassword = (req, res, next) => {
  argon2
    .hash(req.body.password, hashingOptions) // récupérer le mot de passe à hacher avec req.body.password et utiliser la fonction hashingOptions
    .then((hashedPassword) => {
      console.log(hashedPassword); // afficher le resultat de la version hachée

      req.body.hashedPassword = hashedPassword; // stocker le mot de passe haché dans req.body.hashedPassword.
      delete req.body.password; // s'assurer que le mot de passe en clair ne pourra plus être utilisé après ce middleware, on supp le password en clair

      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyPassword = (req, res) => {

  argon2
    .verify(req.user.hashedPassword, req.body.password) // la fonction compare le mdp de l'utilisateur avec celui entré dans le body
    .then((isVerified) => { // si c'est true
      if (isVerified) {
        const payload = { sub: req.user.id }; // sub signifie sujet, celui pour qui le token sera créé
        const token = jwt.sign(payload, process.env.JWT_SECRET, { // on doit signer le token pour s'assurer que personne d'autre n'utilisera le meme, JWT_SECRET est dans le .env
          expiresIn: "1h", // le token doit expirer 1 heure après sa création
        });
        delete req.user.hashedPassword; // on supp le hashedPassword pour ne pas le renvoyer dans la réponse
        res.send({ token, user: req.user }); // on renvoie le token en guise de réponse en plus des données de l'user, sans le mdp
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};


const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization"); // on recupere l'en-tête authorization

    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing");
    }

    const [type, token] = authorizationHeader.split(" ");

    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type"); // si le type !== Bearer, return error
    }

    req.payload = jwt.verify(token, process.env.JWT_SECRET); // si c'est true, on rempli le req.payload avec le payload decodé grâce à la signature JWT_SECRET

    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};


module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken
};