-- ============================================================
-- phpMyAdmin Quick Import: 3 New Team Members
-- Rohail (ppl-11), Chaandan Gadi (ppl-12), Laiba Siddiqi (ppl-13)
-- ============================================================

INSERT INTO `people` (`id`, `name`, `role`, `category`, `bio`, `image`, `email`, `sortOrder`, `showInGrid`, `createdAt`, `updatedAt`) VALUES
('ppl-11', 'Rohail', 'Office Assistant', 'Core Team', 'Rohail works as an Office Assistant at Climate Action & Energy Access (CAEA), where he supports daily office operations, manages routine administrative tasks, and assists with logistics and office arrangements. He plays an important role in keeping the workplace organized and ensuring smooth day-to-day activities.', 'assets/team/Rohail.png', 'rohail@climateactionenergyaccess.org', 11, 1, '2026-11-02 11:02:05', '2026-11-02 11:02:05'),
('ppl-12', 'Chaandan Gadi', 'Software Developer', 'Core Team', 'Chaandan Gadi is a Software Developer at Climate Action & Energy Access (CAEA), where he manages and maintains the organization\'s natural gas and renewable energy dashboard, supporting data accessibility and digital tools for energy research and analysis.', 'assets/team/Chandan.png', 'chaandangadi@climateactionenergyaccess.org', 12, 1, '2026-11-02 11:02:05', '2026-11-02 11:02:05'),
('ppl-13', 'Laiba Siddiqi', 'Senior Associate - Textiles', 'Core Team', 'Laiba Siddiqi is a researcher and analyst focusing on energy policy, clean energy transitions, and the experiences of local communities in the midst of climatic upheaval. She graduated from the Lahore University of Management Sciences in 2023 with a Bachelors in Political Science and History. At CAEA, she heads the Climate Justice in Textiles campaign against fast fashion and its contributions to ecological degradation. More broadly, her interest lies in exploring how local and international public institutions and public decision-making can be made accessible to communities on the frontlines of the climate crisis.', 'assets/CAEA-Navbar-Logo.png', 'laibasiddiqi@climateactionenergyaccess.org', 13, 0, '2026-11-02 11:02:06', '2026-11-02 11:02:06')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `role` = VALUES(`role`),
  `category` = VALUES(`category`),
  `bio` = VALUES(`bio`),
  `image` = VALUES(`image`),
  `email` = VALUES(`email`),
  `sortOrder` = VALUES(`sortOrder`),
  `showInGrid` = VALUES(`showInGrid`),
  `updatedAt` = VALUES(`updatedAt`);
