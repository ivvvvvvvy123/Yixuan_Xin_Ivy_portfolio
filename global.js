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

  const titleHTML = `<${headingLevel} class="project-title">${project.title || ''}</${headingLevel}>`;
  const placeHTML = project.place ? `<p class="project-meta">${project.place}</p>` : '';
  const descriptionHTML = `<p class="project-description">${project.description || ''}</p>`;
  const yearHTML = project.year ? `<p class="project-meta"><strong>Year:</strong> ${project.year}</p>` : '';
  const linkHTML = project.link
    ? `<p><a href="${project.link}" target="_blank" rel="noopener" class="project-link">View Project</a></p>`
    : '';

  article.innerHTML = `${titleHTML}${placeHTML}${descriptionHTML}${yearHTML}${linkHTML}`;
  containerElement.appendChild(article);
}

export async function fetchGithubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
