// Shared helpers for the portfolio pages.

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
  const article = document.createElement('article');
  article.className = 'project-card';

  // Title itself is the link (no separate "View Project" button)
  const title = project.link
    ? `<a href="${project.link}" target="_blank" rel="noopener">${project.title || ''}</a>`
    : (project.title || '');

  article.innerHTML = `
    <div class="project-side">
      ${project.year ? `<span class="project-year">${project.year}</span>` : ''}
      ${project.place ? `<p class="project-meta">${project.place}</p>` : ''}
    </div>
    <div class="project-main">
      <${headingLevel} class="project-title${project.link ? ' has-link' : ''}">${title}</${headingLevel}>
      <p class="project-description">${project.description || ''}</p>
    </div>`;
  containerElement.appendChild(article);
}

export async function fetchGithubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
