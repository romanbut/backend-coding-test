const healthRoutes = [
  {
    type: 'get',
    path: '/health',
    handler: async (req, res) => res.send('Healthy'),
  },
];

module.exports = healthRoutes;
