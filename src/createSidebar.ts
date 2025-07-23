// src/Sidebar.ts
// Higher-order component for responsive sidebar

export function createSidebar(): HTMLElement {
  const sidebar = document.createElement('aside');
  sidebar.innerHTML = `<div style="padding:2rem; color:#fff; font-family:sans-serif;">
    <h2>Sand Game Sidebar</h2>
    <p>Controls and info go here.</p>
    <form id="ai-draw-form" style="margin-top:2rem; display:flex; flex-direction: column; gap:0.5rem;">
      <input id="ai-draw-input" type="text" placeholder="Describe what to draw..." style="flex:1; padding:0.5rem 1rem; border-radius:8px; border:none; font-size:1rem;" />
      <button type="submit" style="background:#ffda50; color:#222; border:none; border-radius:8px; padding:0.5rem 1rem; font-size:1rem; cursor:pointer;">Go!</button>
    </form>
  </div>`;
  // Dummy submit handler for AI draw form
  setTimeout(() => {
    const form = sidebar.querySelector('#ai-draw-form') as HTMLFormElement | null;
    const input = sidebar.querySelector('#ai-draw-input') as HTMLInputElement | null;
    if (form && input) {
      form.onsubmit = (e) => {
        e.preventDefault();
        if (input.value.trim()) {
          alert('AI would draw: ' + input.value.trim());
          input.value = '';
        }
      };
    }
  }, 0);
  sidebar.style.width = '320px';
  sidebar.style.background = 'rgba(30,30,40,0.98)';
  sidebar.style.boxShadow = '0 0 16px rgba(0,0,0,0.2)';
  sidebar.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  sidebar.style.height = '100vh';
  sidebar.style.position = 'fixed';
  sidebar.style.top = '0';
  sidebar.style.right = '0';
  sidebar.style.zIndex = '1000';
  sidebar.style.display = 'block';
  sidebar.style.opacity = '0';

  // Always create the toggle button and keep it visible
  let open = false;
  let toggle = document.getElementById('sidebar-toggle') as HTMLButtonElement | null;
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.id = 'sidebar-toggle';
    toggle.innerText = '☰';
    toggle.style.position = 'absolute';
    toggle.style.right = '16px';
    toggle.style.top = '16px';
    toggle.style.zIndex = '1100';
    toggle.style.background = '#222';
    toggle.style.color = '#fff';
    toggle.style.border = 'none';
    toggle.style.fontSize = '2rem';
    toggle.style.padding = '0.5rem 1rem';
    toggle.style.borderRadius = '8px';
    toggle.style.cursor = 'pointer';
    document.body.appendChild(toggle);
  }
  // Always start closed
  sidebar.style.transform = 'translateX(100%)';
  sidebar.style.opacity = '0';
  open = false;
  toggle.onclick = () => {
    open = !open;
    sidebar.style.transform = open ? 'translateX(0)' : 'translateX(100%)';
    sidebar.style.opacity = open ? '1' : '0';
  };

  return sidebar;
}
