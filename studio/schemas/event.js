export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Event Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'venue',
      title: 'Venue',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Venue Name',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'address',
          title: 'Address',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ]
    },
    {
      name: 'date',
      title: 'Event Date & Time',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'ticketLink',
      title: 'Ticket Link',
      type: 'url',
      validation: Rule => Rule.required()
    },
    {
      name: 'lineup',
      title: 'Lineup',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'artist',
              title: 'Artist Name',
              type: 'string'
            },
            {
              name: 'time',
              title: 'Set Time',
              type: 'string'
            }
          ],
          preview: {
            select: {
              title: 'artist',
              subtitle: 'time'
            }
          }
        }
      ]
    },
    {
      name: 'genres',
      title: 'Genres',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'House', value: 'house' },
          { title: 'Techno', value: 'techno' },
          { title: 'Deep House', value: 'deep-house' },
          { title: 'Tech House', value: 'tech-house' }
        ]
      }
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'poster',
      title: 'Poster Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string'
        }
      ]
    },
    {
      name: 'price',
      title: 'Price',
      type: 'object',
      fields: [
        {
          name: 'amount',
          title: 'Amount',
          type: 'number'
        },
        {
          name: 'currency',
          title: 'Currency',
          type: 'string',
          initialValue: 'EUR',
          options: {
            list: [
              { title: 'EUR (€)', value: 'EUR' }
            ]
          }
        }
      ]
    }
  ]
} 