import { Router, Request, Response } from 'express';
import { Survey } from '../../models';

const router = Router();

// Получение всех опросов
router.get('/', async (req: Request, res: Response) => {
  try {
    const surveys = await Survey.findAll();
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении опросов' });
  }
});

// Создание нового опроса
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const newSurvey = await Survey.create({ title, description });
    res.json(newSurvey);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании опроса' });
  }
});

export default router;
