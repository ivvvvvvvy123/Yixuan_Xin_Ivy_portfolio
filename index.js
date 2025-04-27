import { fetchJSON, renderProjects, fetchGithubData } from './global.js';

async function loadAndRenderHomePage() {
  const projects = await fetchJSON('./lib/projects.json');
  const latestProjects = projects.slice(0, 3);

  const projectsContainer = document.querySelector('.projects');
  projectsContainer.innerHTML = '';

  for (const project of latestProjects) {
    renderProjects(project, projectsContainer, 'h2');
  }

  const githubData = await fetchGithubData('ivvvvvvvy123');
  const profileStats = document.querySelector('#profile-stats');
  if (profileStats) {
    profileStats.innerHTML = `
      <dl>
        <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
        <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
        <dt>Followers:</dt><dd>${githubData.followers}</dd>
        <dt>Following:</dt><dd>${githubData.following}</dd>
      </dl>
    `;
  }
}
loadAndRenderHomePage();