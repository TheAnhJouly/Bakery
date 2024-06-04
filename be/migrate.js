const db = require('./models/index')

db.sequelize.sync({ force: true }).then(() => {
  console.log('yes resync done')
})

