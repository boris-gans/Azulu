import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Azulu',

  projectId: '924kpawb',
  dataset: 'events',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
