import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
    
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }
    
        const user = this.userRepository.create({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10),
        });
    
        return this.userRepository.save(user);
    }

    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (user && user.isActive == false) {
            throw new UnauthorizedException('Account Banned. Please Contact Admin');
        }
        if (user && (await bcrypt.compare(password, user.password))) {
            const payload = { email: user.email, userId: user.id, role: user.role };
            const accessToken = this.jwtService.sign(payload);
            let returnedUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken: accessToken
            }
            return returnedUser
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async findAllUsers(paginationDto: { page: number, limit: number }): Promise<{ data: User[], total: number, page: number, limit: number }> {
        const { page, limit } = paginationDto;
        const [data, total] = await this.userRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            select: ['id', 'name', 'email', 'role', 'createdAt'],
            order: {
                createdAt: 'DESC',
            },
        });
    
        return {
            data,
            total,
            page,
            limit,
        };
    }
    
    

    async banUser(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            throw new UnauthorizedException('User not found.');
        }

        user.isActive = !user.isActive;
        return this.userRepository.save(user);
    }
}
