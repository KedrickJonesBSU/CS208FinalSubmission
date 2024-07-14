// /public/js/student3.js
document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const commentId = event.target.getAttribute('data-id');
        fetch('/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: commentId })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Remove the deleted comment from the DOM
            event.target.parentNode.remove();
          } else {
            console.error('Error:', data.error);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      });
    });
  
    // Edit comment functionality
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const commentId = event.target.getAttribute('data-id');
        const commentTextElement = event.target.previousElementSibling;
        const currentText = commentTextElement.textContent;
  
        const newText = prompt('Edit your comment:', currentText);
        if (newText !== null && newText.trim() !== '') {
          fetch('/edit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: commentId, newComment: newText })
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              commentTextElement.textContent = newText;
            } else {
              console.error('Error:', data.error);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
        }
      });
    });
  
    // Delete All button with confirmation
    const deleteAllBtn = document.getElementById('delete-all-btn');
    deleteAllBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete all comments?')) {
        fetch('/delete/all', {
          method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Remove all comments from the DOM
            document.querySelector('ul').innerHTML = '';
          } else {
            console.error('Error:', data.error);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    });
  });
  