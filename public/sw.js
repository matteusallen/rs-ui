function handlePush(event) {
  const { downloadLink, title, text } = event.data.json()

  const icon = 'https://www.openstalls.com/favicon.ico'
  const options = {
    data: downloadLink,
    body: text || 'Your report is ready for download.',
    icon: icon,
    image: icon,
    badge: icon,
    vibrate: [200, 100, 200],
    actions: [{ action: 'download', title: 'Download' }],
  }
  event.waitUntil(
    self.registration.showNotification(
      title || 'Rodeo Logistics - Open Stalls',
      options,
    ),
  )
}

function handleClick(event) {
  if (event.action === 'download' || !event.action) {
    // eslint-disable-next-line no-undef
    event.waitUntil(clients.openWindow(event.notification.data))
  }
  event.notification.close()
}

self.addEventListener('push', handlePush)
self.addEventListener('notificationclick', handleClick)
