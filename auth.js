const argon2 = require("argon2");

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


module.exports = {
  hashPassword,
};